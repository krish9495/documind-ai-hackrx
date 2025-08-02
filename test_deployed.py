#!/usr/bin/env python3
"""
Test script for DEPLOYED HackRX webhook endpoint
Use this after deploying to Railway/Render
"""

import requests
import json
import os

# Configuration - UPDATE THIS WITH YOUR DEPLOYED URL
DEPLOYED_URL = "https://documind-ai-hackrx.onrender.com"  # Update with your actual Render URL
API_TOKEN = "hackrx-2024-bajaj-finserv"

def test_deployed_webhook():
    """Test the deployed webhook endpoint"""
    url = f"{DEPLOYED_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Test payload (using URL document instead of local file)
    payload = {
        "documents": "https://raw.githubusercontent.com/example/docs/main/sample.pdf",
        "questions": [
            "What is the main topic of this document?",
            "What are the key benefits mentioned?"
        ],
        "document_format": "pdf",
        "processing_options": {
            "include_citations": True,
            "max_tokens": 500,
            "temperature": 0.3
        }
    }
    
    print("Testing DEPLOYED HackRX webhook...")
    print(f"URL: {url}")
    print(f"Request: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ DEPLOYMENT SUCCESSFUL! Ready for HackRX submission!")
            print(f"🔗 Submit this URL: {url}")
        else:
            print(f"\n❌ Deployment issue. Status: {response.status_code}")
            
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def health_check():
    """Check if the deployed service is running"""
    url = f"{DEPLOYED_URL}/health"
    
    try:
        response = requests.get(url, timeout=30)
        print(f"Health Check - Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Service is running!")
            return True
    except Exception as e:
        print(f"❌ Service not reachable: {e}")
        return False

def main():
    """Run deployment tests"""
    print("HackRX Deployment Verification")
    print("=" * 40)
    print(f"Testing URL: {DEPLOYED_URL}")
    
    # Step 1: Health check
    print("\n1. Health Check:")
    health_ok = health_check()
    
    # Step 2: Webhook test
    print("\n2. Webhook Test:")
    webhook_ok = test_deployed_webhook()
    
    print("\n" + "=" * 40)
    print("DEPLOYMENT STATUS:")
    print(f"Health Check: {'PASSED' if health_ok else 'FAILED'}")
    print(f"Webhook Test: {'PASSED' if webhook_ok else 'FAILED'}")
    
    if health_ok and webhook_ok:
        print(f"\n🎉 READY FOR HACKRX SUBMISSION!")
        print(f"📝 Submit this webhook URL: {DEPLOYED_URL}/api/v1/hackrx/run")
    else:
        print("\n❌ Deployment needs fixing before submission.")

if __name__ == "__main__":
    # Check if user updated the URL
    if "your-app-name" in DEPLOYED_URL:
        print("⚠️  Please update DEPLOYED_URL with your actual Railway app URL!")
        print("Example: https://documind-ai-production.railway.app")
    else:
        main()
