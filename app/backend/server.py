import base64
import binascii
import mimetypes
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client

from catalog import PRODUCTS, CATEGORIES
from models import Customization, CustomizationCreate, Order, OrderCreate
import payments

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# Supabase client initialization
supabase_url = os.environ.get('SUPABASE_URL')
# Use service role key for backend operations to bypass RLS
supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI(debug=False)
api_router = APIRouter(prefix="/api")


def save_photo_from_base64(base64_data: str) -> str:
    """Save a data: URI image to disk, return the public /api/uploads/<file> URL."""
    if not base64_data or not base64_data.startswith('data:'):
        return ''
    try:
        header, encoded = base64_data.split(',', 1)
        mime = header.split(':')[1].split(';')[0]
        ext = mimetypes.guess_extension(mime) or '.jpg'
        if ext == '.jpe':
            ext = '.jpg'
        filename = f"{uuid.uuid4()}{ext}"
        filepath = UPLOADS_DIR / filename
        filepath.write_bytes(base64.b64decode(encoded))
        return f"/api/uploads/{filename}"
    except (ValueError, binascii.Error, IndexError):
        return ''


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "printalaram-api"}


@api_router.get("/uploads/{filename}")
async def get_upload(filename: str):
    filepath = UPLOADS_DIR / filename
    if not filepath.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)


@api_router.get("/products")
async def list_products(category: str | None = None, featured: str | None = None, bestSeller: str | None = None):
    items = PRODUCTS
    if category:
        items = [p for p in items if p["category"] == category]
    if featured == 'true':
        items = [p for p in items if p["featured"]]
    if bestSeller == 'true':
        items = [p for p in items if p["bestSeller"]]
    return {"products": items}


@api_router.get("/categories")
async def list_categories():
    return {"categories": CATEGORIES}


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = next((p for p in PRODUCTS if p["id"] == product_id or p["slug"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": product}


@api_router.post("/customizations", status_code=201)
async def create_customization(payload: CustomizationCreate):
    couple_photo_url = save_photo_from_base64(payload.couplePhoto) if payload.couplePhoto.startswith('data:') else ''
    customization = Customization(
        productId=payload.productId,
        name=payload.name,
        familyName=payload.familyName,
        couplePhoto=couple_photo_url,
    )
    result = supabase.table("customizations").insert(customization.model_dump()).execute()
    return {"customization": customization.model_dump()}


@api_router.get("/customizations/{customization_id}")
async def get_customization(customization_id: str):
    result = supabase.table("customizations").select("*").eq("id", customization_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Not found")
    return {"customization": result.data[0]}


async def create_order(payload: OrderCreate):
    try:
        order_number = "PRT" + str(uuid.uuid4().int)[:8]

        # Convert relative image paths to absolute URLs using frontend URL
        product_image = payload.productImage
        frontend_url = os.environ.get('FRONTEND_URL', '').rstrip('/')
        if frontend_url and product_image.startswith('/'):
            product_image = frontend_url + product_image

        order = Order(
            orderNumber=order_number,
            productId=payload.productId,
            productName=payload.productName,
            productImage=product_image,
            customization=payload.customization,
            quantity=payload.quantity,
            price=payload.price,
            total=payload.total,
            customer={
                "name": payload.customerName,
                "email": payload.email,
                "phone": payload.mobile,
                "address": payload.address,
            },
            paymentMethod=payload.paymentMethod,
            paymentStatus="pending",
            orderStatus="confirmed",
            razorpayOrderId="",
            razorpayPaymentId="",
            razorpaySignature="",
        )
        result = supabase.table("orders").insert(order.model_dump()).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create order")
        return {"order": result.data[0]}
    except Exception as e:
        # Log the exception for debugging
        print(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
async def get_order(order_id: str):
    result = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Not found")
    return {"order": result.data[0]}


@api_router.post("/payments/create-order")
async def payments_create_order(payload: dict):
    order_id = payload.get("orderId")
    amount = payload.get("amount")
    if not order_id or not amount:
        raise HTTPException(status_code=400, detail="orderId and amount required")

    result = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    order = result.data[0]

    result_payment = payments.create_order(order["orderNumber"], order["id"], order["customer"]["name"], order["customer"]["mobile"], float(amount))
    if not result_payment["simulated"]:
        supabase.table("orders").update({"razorpayOrderId": result_payment["razorpayOrderId"]}).eq("id", order_id).execute()
    return result_payment


@api_router.post("/payments/simulate")
async def payments_simulate(payload: dict):
    order_id = payload.get("orderId")
    if not order_id:
        raise HTTPException(status_code=400, detail="orderId required")
    simulated_payment_id = f"pay_sim_{uuid.uuid4().hex[:12]}"
    supabase.table("orders").update({
        "paymentStatus": "paid",
        "razorpayPaymentId": simulated_payment_id,
        "paymentMethod": "Razorpay (Test)"
    }).eq("id", order_id).execute()
    updated = supabase.table("orders").select("*").eq("id", order_id).execute()
    return {"success": True, "order": updated.data[0]}


@api_router.post("/payments/verify")
async def payments_verify(payload: dict):
    razorpay_order_id = payload.get("razorpay_order_id")
    razorpay_payment_id = payload.get("razorpay_payment_id")
    razorpay_signature = payload.get("razorpay_signature")
    order_id = payload.get("orderId")
    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id]):
        raise HTTPException(status_code=400, detail="Missing verification params")

    valid = payments.verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if not valid:
        supabase.table("orders").update({
            "paymentStatus": "failed",
            "razorpayPaymentId": razorpay_payment_id
        }).eq("id", order_id).execute()
        raise HTTPException(status_code=400, detail="Invalid signature")

    supabase.table("orders").update({
        "paymentStatus": "paid",
        "razorpayPaymentId": razorpay_payment_id
    }).eq("id", order_id).execute()
    updated = supabase.table("orders").select("*").eq("id", order_id).execute()
    return {"success": True, "order": updated.data[0]}


cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    allow_origins = '*'
else:
    allow_origins = cors_origins.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    # Supabase client doesn't require explicit cleanup
    pass