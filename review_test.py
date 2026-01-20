#!/usr/bin/env python3
"""
Specific endpoint tests as requested in the review
"""

import requests
import json

# Test the exact endpoints mentioned in the review request
BASE_URL = "https://prascy-shop.preview.emergentagent.com"
TELEGRAM_HEADER = "auth_date=1768893667&query_id=AAHdF6IQAAAAAN0XohDhrPgC&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&hash=014ba481f7eb2e48e666f433c1f435564e3fc613ea01a14e63abb56569de30a1"

def test_specific_endpoints():
    print("🎯 Testing specific endpoints from review request...")
    print("=" * 60)
    
    # Test 1: GET /api/products
    print("1️⃣ Testing GET /api/products")
    try:
        response = requests.get(f"{BASE_URL}/api/products", timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"   ✅ SUCCESS: Got {len(products)} products")
        else:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
    
    print()
    
    # Test 2: GET /api/orders with Telegram header
    print("2️⃣ Testing GET /api/orders with X-Telegram-Init-Data header")
    headers = {'X-Telegram-Init-Data': TELEGRAM_HEADER}
    try:
        response = requests.get(f"{BASE_URL}/api/orders", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            orders = response.json()
            print(f"   ✅ SUCCESS: Got {len(orders)} orders (empty list expected for new user)")
        else:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")

if __name__ == "__main__":
    test_specific_endpoints()