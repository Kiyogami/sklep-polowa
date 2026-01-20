#!/usr/bin/env python3
"""
Debug script to understand Telegram WebApp auth data format
"""

import json
from urllib.parse import parse_qsl, unquote

# Test data from the review request
TELEGRAM_INIT_DATA = "auth_date=1768893667&query_id=AAHdF6IQAAAAAN0XohDhrPgC&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&hash=014ba481f7eb2e48e666f433c1f435564e3fc613ea01a14e63abb56569de30a1"

def debug_telegram_data():
    print("🔍 Debugging Telegram WebApp init data...")
    
    # Parse the query string
    data = dict(parse_qsl(TELEGRAM_INIT_DATA, keep_blank_values=True))
    
    print("Raw parsed data:")
    for key, value in data.items():
        print(f"  {key}: {value}")
    
    print("\nUser field details:")
    user_raw = data.get('user', '')
    print(f"  Raw: {user_raw}")
    
    # URL decode
    user_decoded = unquote(user_raw)
    print(f"  Decoded: {user_decoded}")
    
    # Parse JSON
    try:
        user_parsed = json.loads(user_decoded)
        print(f"  Parsed JSON: {user_parsed}")
        print(f"  User ID: {user_parsed.get('id')}")
    except json.JSONDecodeError as e:
        print(f"  JSON Parse Error: {e}")

if __name__ == "__main__":
    debug_telegram_data()