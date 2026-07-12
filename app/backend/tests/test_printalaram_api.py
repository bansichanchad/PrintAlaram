"""Backend API tests for Printalaram (catalog, customizations, orders, payments, uploads)."""
import base64
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

# 1x1 transparent PNG for photo upload tests
TINY_PNG_B64 = "data:image/png;base64," + base64.b64encode(
    base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
    )
).decode()


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestHealth:
    def test_health(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"


class TestCatalog:
    def test_list_products_count(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) == 10
        expected_ids = {f"card-{i}" for i in range(1, 11)}
        by_id = {p["id"]: p for p in products}
        assert set(by_id.keys()) == expected_ids
        # Check a few sample products
        assert by_id["card-1"]["name"] == "Card Design 1"
        assert by_id["card-1"]["photoUploadEnabled"] is True
        assert by_id["card-5"]["name"] == "Card Design 5"
        assert by_id["card-5"]["photoUploadEnabled"] is True
        assert by_id["card-10"]["name"] == "Card Design 10"
        assert by_id["card-10"]["photoUploadEnabled"] is True
        for pid, p in by_id.items():
            assert p["description"] == ""
            assert p["features"] == []
            assert "layout" in p
            assert "name" in p["layout"] and "family" in p["layout"]
            # photo config present for all
            assert p["layout"]["photo"] is not None
            for key in ["top", "left", "width", "height"]:
                assert key in p["layout"]["photo"]

    def test_new_products_layout_photo_config(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products")
        products = {p["id"]: p for p in r.json()["products"]}
        # All cards have a photo rectangle config
        for pid in [f"card-{i}" for i in range(1, 11)]:
            photo_cfg = products[pid]["layout"]["photo"]
            assert photo_cfg is not None
            for key in ["top", "left", "width", "height"]:
                assert key in photo_cfg

    def test_filter_featured(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products", params={"featured": "true"})
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) > 0
        assert all(p["featured"] for p in products)

    def test_filter_bestseller(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products", params={"bestSeller": "true"})
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) > 0
        assert all(p["bestSeller"] for p in products)

    def test_filter_category(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products", params={"category": "sacred-tradition"})
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) == 5
        assert all(p["category"] == "sacred-tradition" for p in products)
        ids = {p["id"] for p in products}
        assert ids == {f"card-{i}" for i in range(1, 6)}

    def test_filter_category_wedding_royal(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products", params={"category": "wedding-royal"})
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) == 5
        assert all(p["category"] == "wedding-royal" for p in products)
        ids = {p["id"] for p in products}
        assert ids == {f"card-{i}" for i in range(6, 11)}

    def test_get_single_product(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products/card-1")
        assert r.status_code == 200
        product = r.json()["product"]
        assert product["id"] == "card-1"
        assert len(product["gallery"]) == 1
        assert product["gallery"][0] == product["image"]
        assert product["gallery"][0] == "/cards/card-1.jpeg"
        assert product["description"] == ""
        assert product["features"] == []
        assert product["price"] == 15
        assert product["photoUploadEnabled"] is True

    def test_get_product_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/products/card-999")
        assert r.status_code == 404

    def test_categories(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/categories")
        assert r.status_code == 200
        cats = r.json()["categories"]
        assert len(cats) == 2
        ids = {c["id"] for c in cats}
        assert ids == {"sacred-tradition", "wedding-royal"}

    def test_get_new_products_individually(self, api_client):
        for pid, name in [("card-2", "Card Design 2"), ("card-3", "Card Design 3"), ("card-4", "Card Design 4")]:
            r = api_client.get(f"{BASE_URL}/api/products/{pid}")
            assert r.status_code == 200
            product = r.json()["product"]
            assert product["name"] == name
            assert product["photoUploadEnabled"] is True
            assert product["price"] == 15
            assert product["originalPrice"] == 49


class TestCustomizations:
    def test_create_and_get_customization_with_photo(self, api_client):
        payload = {
            "productId": "card-1",
            "name": "TEST_Arjun",
            "familyName": "Sharma",
            "couplePhoto": TINY_PNG_B64,
        }
        r = api_client.post(f"{BASE_URL}/api/customizations", json=payload)
        assert r.status_code == 201
        cust = r.json()["customization"]
        assert cust["name"] == "TEST_Arjun"
        assert cust["familyName"] == "Sharma"
        assert cust["couplePhoto"].startswith("/api/uploads/")
        assert "groomName" not in cust
        assert "brideName" not in cust
        assert "weddingDate" not in cust
        assert "personalMessage" not in cust
        cust_id = cust["id"]

        # GET verify persistence
        get_r = api_client.get(f"{BASE_URL}/api/customizations/{cust_id}")
        assert get_r.status_code == 200
        fetched = get_r.json()["customization"]
        assert fetched["name"] == "TEST_Arjun"
        assert fetched["familyName"] == "Sharma"

        # Verify uploaded photo URL is reachable (not 404)
        photo_r = api_client.get(f"{BASE_URL}{cust['couplePhoto']}")
        assert photo_r.status_code == 200
        assert photo_r.headers.get("content-type", "").startswith("image/")

    def test_create_customization_without_photo(self, api_client):
        payload = {"productId": "card-1", "name": "TEST_A", "familyName": "TEST_B"}
        r = api_client.post(f"{BASE_URL}/api/customizations", json=payload)
        assert r.status_code == 201
        cust = r.json()["customization"]
        assert cust["couplePhoto"] == ""
        assert cust["name"] == "TEST_A"

    def test_create_customization_minimal_name_only(self, api_client):
        payload = {"productId": "card-1", "name": "TEST_OnlyName"}
        r = api_client.post(f"{BASE_URL}/api/customizations", json=payload)
        assert r.status_code == 201
        cust = r.json()["customization"]
        assert cust["name"] == "TEST_OnlyName"
        assert cust["familyName"] == ""
        assert cust["couplePhoto"] == ""

    def test_get_customization_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/customizations/nonexistent-id")
        assert r.status_code == 404

    @pytest.mark.parametrize("product_id", ["card-2", "card-3", "card-4"])
    def test_create_customization_for_new_products(self, api_client, product_id):
        payload = {
            "productId": product_id,
            "name": f"TEST_Name_{product_id}",
            "familyName": "TEST_Family",
            "couplePhoto": TINY_PNG_B64,
        }
        r = api_client.post(f"{BASE_URL}/api/customizations", json=payload)
        assert r.status_code == 201
        cust = r.json()["customization"]
        assert cust["productId"] == product_id
        assert cust["couplePhoto"].startswith("/api/uploads/")
        cust_id = cust["id"]

        get_r = api_client.get(f"{BASE_URL}/api/customizations/{cust_id}")
        assert get_r.status_code == 200
        assert get_r.json()["customization"]["productId"] == product_id


class TestOrders:
    def _order_payload(self, payment_method="RAZORPAY"):
        return {
            "productId": "card-1",
            "productName": "Regal Shagun Lifafa",
            "productImage": "/cards/card-1.jpg",
            "customization": None,
            "quantity": 50,
            "price": 13,
            "total": 650,
            "customerName": "TEST_Customer",
            "mobile": "9999999999",
            "whatsapp": "9999999999",
            "email": "test@example.com",
            "address": "123 Test Street",
            "city": "Surat",
            "state": "Gujarat",
            "pincode": "395007",
            "paymentMethod": payment_method,
        }

    def test_create_order_cod_and_verify(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/orders", json=self._order_payload("COD"))
        assert r.status_code == 201
        order = r.json()["order"]
        assert order["orderNumber"].startswith("PRT")
        assert order["paymentMethod"] == "COD"
        assert order["paymentStatus"] == "pending"
        order_id = order["id"]

        get_r = api_client.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_r.status_code == 200
        fetched = get_r.json()["order"]
        assert fetched["customer"]["name"] == "TEST_Customer"
        assert fetched["total"] == 650

    def test_get_order_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/orders/nonexistent-id")
        assert r.status_code == 404

    def test_razorpay_simulated_flow(self, api_client):
        # Create order
        r = api_client.post(f"{BASE_URL}/api/orders", json=self._order_payload("RAZORPAY"))
        assert r.status_code == 201
        order = r.json()["order"]
        order_id = order["id"]

        # create-order should be simulated (no real keys configured)
        cr = api_client.post(f"{BASE_URL}/api/payments/create-order", json={"orderId": order_id, "amount": order["total"]})
        assert cr.status_code == 200
        cr_data = cr.json()
        assert cr_data["simulated"] is True
        assert cr_data["razorpayOrderId"].startswith("order_simulated_")

        # simulate payment
        sr = api_client.post(f"{BASE_URL}/api/payments/simulate", json={"orderId": order_id})
        assert sr.status_code == 200
        sim = sr.json()
        assert sim["success"] is True
        assert sim["order"]["paymentStatus"] == "paid"
        assert sim["order"]["razorpayPaymentId"].startswith("pay_sim_")

    def test_payments_create_order_missing_fields(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/payments/create-order", json={})
        assert r.status_code == 400

    def test_payments_create_order_invalid_order(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/payments/create-order", json={"orderId": "bogus", "amount": 100})
        assert r.status_code == 404

    @pytest.mark.parametrize("product_id", ["card-2", "card-3", "card-4"])
    def test_create_order_for_new_products(self, api_client, product_id):
        payload = self._order_payload("COD")
        payload["productId"] = product_id
        r = api_client.post(f"{BASE_URL}/api/orders", json=payload)
        assert r.status_code == 201
        order = r.json()["order"]
        assert order["productId"] == product_id
        order_id = order["id"]
        get_r = api_client.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_r.status_code == 200
        assert get_r.json()["order"]["productId"] == product_id