#!/usr/bin/env python3
"""
Backend API Testing Script for Prascy Shop
Tests the core backend functionality including products and orders endpoints.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "https://prascy-shop.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

# Test Telegram WebApp auth header from the review request
TELEGRAM_INIT_DATA = "auth_date=1768893667&query_id=AAHdF6IQAAAAAN0XohDhrPgC&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&hash=014ba481f7eb2e48e666f433c1f435564e3fc613ea01a14e63abb56569de30a1"

def test_products_endpoint():
    """Test GET /api/products endpoint"""
    print("🧪 Testing GET /api/products...")
    
    try:
        response = requests.get(f"{API_BASE}/products", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            products = response.json()
            print(f"   ✅ SUCCESS: Retrieved {len(products)} products")
            
            if products:
                print(f"   📦 Sample product: {products[0].get('name', 'Unknown')}")
                # Validate product structure
                required_fields = ['id', 'name', 'price', 'description']
                sample_product = products[0]
                missing_fields = [field for field in required_fields if field not in sample_product]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in product: {missing_fields}")
                else:
                    print(f"   ✅ Product structure is valid")
            else:
                print(f"   ⚠️  No products found in database")
            
            return True, products
        else:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAILED: Request error - {e}")
        return False, None

def test_orders_endpoint():
    """Test GET /api/orders endpoint with Telegram auth"""
    print("🧪 Testing GET /api/orders with Telegram auth...")
    
    headers = {
        'X-Telegram-Init-Data': TELEGRAM_INIT_DATA,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{API_BASE}/orders", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"   ✅ SUCCESS: Retrieved {len(orders)} orders")
            
            if orders:
                print(f"   📋 Sample order ID: {orders[0].get('id', 'Unknown')}")
            else:
                print(f"   📋 No orders found for user (expected for new user)")
            
            return True, orders
        elif response.status_code == 403:
            print(f"   ❌ FAILED: Authentication failed - {response.text}")
            print(f"   🔍 This might be due to invalid Telegram WebApp auth token")
            return False, None
        else:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAILED: Request error - {e}")
        return False, None

def test_orders_endpoint_without_auth():
    """Test GET /api/orders without auth to verify it's protected"""
    print("🧪 Testing GET /api/orders without auth (should fail)...")
    
    try:
        response = requests.get(f"{API_BASE}/orders", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 422 or response.status_code == 403:
            print(f"   ✅ SUCCESS: Endpoint is properly protected (status {response.status_code})")
            return True
        else:
            print(f"   ❌ FAILED: Expected 422/403, got {response.status_code}")
            print(f"   ⚠️  Endpoint might not be properly protected")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAILED: Request error - {e}")
        return False

def test_create_order():
    """Test POST /api/orders endpoint"""
    print("🧪 Testing POST /api/orders (create order)...")
    
    headers = {
        'X-Telegram-Init-Data': TELEGRAM_INIT_DATA,
        'Content-Type': 'application/json'
    }
    
    # Sample order data
    order_data = {
        "customer": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "123456789",
            "telegramUserId": 123456789,
            "telegramUsername": "testuser"
        },
        "items": [
            {
                "productId": "test-product-1",
                "name": "Test Product",
                "variant": "Standard",
                "quantity": 1,
                "unitPrice": 29.99,
                "totalPrice": 29.99
            }
        ],
        "delivery": {
            "method": "inpost",
            "lockerCode": "WAW123"
        },
        "payment": {
            "method": "blik",
            "status": "pending",
            "currency": "PLN",
            "subtotal": 29.99,
            "deliveryCost": 5.00,
            "total": 34.99
        },
        "verification": {
            "required": False,
            "status": "skipped"
        }
    }
    
    try:
        response = requests.post(f"{API_BASE}/orders", 
                               headers=headers, 
                               json=order_data, 
                               timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 201:
            order = response.json()
            print(f"   ✅ SUCCESS: Created order with ID: {order.get('id', 'Unknown')}")
            print(f"   📋 Order status: {order.get('status', 'Unknown')}")
            return True, order
        elif response.status_code == 403:
            print(f"   ❌ FAILED: Authentication failed - {response.text}")
            print(f"   🔍 This might be due to invalid Telegram WebApp auth token")
            return False, None
        else:
            print(f"   ❌ FAILED: Expected 201, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAILED: Request error - {e}")
        return False, None

def test_root_endpoint():
    """Test basic connectivity"""
    print("🧪 Testing basic connectivity to /api/...")
    
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ SUCCESS: {data.get('message', 'Connected')}")
            return True
        else:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAILED: Request error - {e}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests")
    print(f"🌐 Testing against: {BASE_URL}")
    print("=" * 60)
    
    results = {}
    
    # Test basic connectivity
    results['connectivity'] = test_root_endpoint()
    print()
    
    # Test products endpoint
    results['products'], products_data = test_products_endpoint()
    print()
    
    # Test orders endpoint protection
    results['orders_protection'] = test_orders_endpoint_without_auth()
    print()
    
    # Test orders endpoint with auth
    results['orders_with_auth'], orders_data = test_orders_endpoint()
    print()
    
    # Test order creation
    results['create_order'], created_order = test_create_order()
    print()
    
    # Summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED!")
        return 0
    else:
        print("⚠️  Some backend tests FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())