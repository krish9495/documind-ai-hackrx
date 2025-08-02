#!/usr/bin/env python3
"""
Test script for deployed HackRX webhook
Update DEPLOYED_URL with your actual deployment URL
"""

import requests
import json

# 🔥 UPDATE THIS WITH YOUR DEPLOYED URL 🔥
DEPLOYED_URL = "https://your-app-name.railway.app"  # Replace with your actual URL
API_TOKEN = "hackrx-2024-bajaj-finserv"

def test_deployed_webhook():
    """Test the deployed webhook endpoint"""
    url = f"{DEPLOYED_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Test payload (using a URL document since uploads/ won't exist on deployment)
    payload = {
        "documents": "https://example.com/sample.pdf",  # Use a public PDF URL
        "questions": [
            "What is this document about?",
            "What are the key points?"
        ],
        "document_format": "pdf",
        "processing_options": {
            "include_citations": True,
            "max_tokens": 300,
            "temperature": 0.3
        }
    }
    
    print(f"Testing deployed webhook: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ SUCCESS! Your webhook is ready for HackRX submission!")
            print(f"🚀 Submit this URL: {url}")
        else:
            print(f"\n❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing webhook: {e}")

if __name__ == "__main__":
    print("HackRX Deployment Test")
    print("=" * 40)
    test_deployed_webhook()
