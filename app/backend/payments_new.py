"""Razorpay helper functions (create order, verify signature).

Falls back to a simulated test-mode response when RAZORPAY keys are not
configured, mirroring the original Printalaram behavior so checkout can be
demoed end-to-end without live credentials.
"""
import hmac
import hashlib
import time
import os
import requests

RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"


def keys_configured() -> bool:
    key_id = os.environ.get("RAZORPAY_KEY_ID", "")
    return bool(key_id) and key_id != "rzp_test_PLACEHOLDER"


def create_order(order_number: str, order_id: str, customer_name: str, mobile: str, amount_rupees: float):
