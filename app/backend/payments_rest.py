

def verify_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "")
    payload = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(key_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, razorpay_signature)
