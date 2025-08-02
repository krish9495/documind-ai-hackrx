#!/usr/bin/env python3
"""
Test script for HackRX webhook endpoint
Tests both single document and array formats
"""

import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:8000"
API_TOKEN = "hackrx-2024-bajaj-finserv"

def test_webhook_single_document():
    """Test with single document (hackathon format)"""
    url = f"{BASE_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Single document format (as per hackathon requirements)
    payload = {
        "documents": "uploads/policy.pdf",  # Updated path
        "questions": [
            "What is the minimum premium amount?",
            "What are the key benefits of this policy?"
        ],
        "document_format": "pdf",
        "processing_options": {
            "include_citations": True,
            "max_tokens": 500,
            "temperature": 0.3
        }
    }
    
    print("Testing HackRX webhook with single document...")
    print(f"Request: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_webhook_multiple_documents():
    """Test with multiple documents (array format)"""
    url = f"{BASE_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Multiple documents format
    payload = {
        "documents": ["uploads/policy.pdf"],  # Updated path - only using one existing file
        "questions": [
            "What documents are included in this analysis?",
            "What are the key benefits of this policy?"
        ],
        "document_format": "pdf",
        "processing_options": {
            "include_citations": True,
            "max_tokens": 500,
            "temperature": 0.3
        }
    }
    
    print("\nTesting HackRX webhook with multiple documents...")
    print(f"Request: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("HackRX Webhook Compatibility Tests")
    print("=" * 40)
    
    # Test 1: Single document (hackathon format)
    test1_passed = test_webhook_single_document()
    
    # Test 2: Multiple documents (our enhanced format)
    test2_passed = test_webhook_multiple_documents()
    
    print("\n" + "=" * 40)
    print("Test Results:")
    print(f"Single Document Test: {'PASSED' if test1_passed else 'FAILED'}")
    print(f"Multiple Documents Test: {'PASSED' if test2_passed else 'FAILED'}")
    
    if test1_passed and test2_passed:
        print("\n✅ All tests passed! Webhook is ready for HackRX submission.")
    else:
        print("\n❌ Some tests failed. Check the server logs.")

if __name__ == "__main__":
    main()
