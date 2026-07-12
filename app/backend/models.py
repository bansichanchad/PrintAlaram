from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import uuid
from datetime import datetime, UTC


class CustomizationCreate(BaseModel):
    productId: str
    name: str = ""
    familyName: str = ""
    couplePhoto: str = ""  # base64 data URI, optional


class Customization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    productId: str
    name: str = ""
    familyName: str = ""
    couplePhoto: str = ""  # public URL, e.g. /api/uploads/xxx.jpg
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())


class OrderCreate(BaseModel):
    productId: str
    productName: str
    productImage: str
    customization: Optional[Dict[str, Any]] = None
    quantity: int = 1
    price: float
    total: float
    customerName: str
    mobile: str
    whatsapp: str
    email: str = ""
    address: str
    city: str
    state: str
    pincode: str
    paymentMethod: str = "RAZORPAY"


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orderNumber: str
    productId: str
    productName: str
    productImage: str
    customization: Optional[Dict[str, Any]] = None
    quantity: int = 1
    price: float
    total: float
    customer: Dict[str, Any]
    paymentMethod: str = "RAZORPAY"
    paymentStatus: str = "pending"
    razorpayOrderId: Optional[str] = None
    razorpayPaymentId: Optional[str] = None
    status: str = "placed"
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
