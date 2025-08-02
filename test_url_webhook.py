#!/usr/bin/env python3
"""
Test script for HackRX webhook with URL document
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
API_TOKEN = "hackrx-2024-bajaj-finserv"

def test_url_document_simple():
    """Test with URL document and fewer questions"""
    url = f"{BASE_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Simple test with URL document
    payload = {
        "documents": "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D",
        "questions": [
            "What is the grace period for premium payment?",
            "What is the waiting period for pre-existing diseases?"
        ],
        "document_format": "auto",
        "processing_options": {
            "chunk_size": 1000,
            "chunk_overlap": 200,
            "top_k_retrieval": 7,
            "include_metadata": True,
            "optimize_for_speed": True,  # Enable speed optimization
            "enable_caching": True
        }
    }
    
    print("Testing HackRX webhook with URL document (simplified)...")
    print(f"Request: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)  # Increased timeout
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_full_hackrx_request():
    """Test with the full HackRX request"""
    url = f"{BASE_URL}/api/v1/hackrx/run"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Full HackRX request
    payload = {
        "documents": [
            "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D"
        ],
        "questions": [
            "What is the grace period for premium payment under the National Parivar Mediclaim Plus Policy?",
            "What is the waiting period for pre-existing diseases (PED) to be covered?",
            "Does this policy cover maternity expenses, and what are the conditions?",
            "What is the waiting period for cataract surgery?",
            "Are the medical expenses for an organ donor covered under this policy?",
            "What is the No Claim Discount (NCD) offered in this policy?",
            "Is there a benefit for preventive health check-ups?",
            "How does the policy define a 'Hospital'?",
            "What is the extent of coverage for AYUSH treatments?",
            "Are there any sub-limits on room rent and ICU charges for Plan A?"
        ],
        "document_format": "auto",
        "processing_options": {
            "chunk_size": 1000,
            "chunk_overlap": 200,
            "top_k_retrieval": 7,
            "include_metadata": True,
            "optimize_for_speed": True,
            "enable_caching": True
        },
        "session_id": "hackrx-test-session"
    }
    
    print("Testing full HackRX request...")
    print(f"Questions count: {len(payload['questions'])}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=300)  # 5 minute timeout
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run tests"""
    print("HackRX URL Document Tests")
    print("=" * 50)
    
    # Test 1: Simple test with 2 questions
    print("Test 1: Simple URL test with 2 questions")
    test1_passed = test_url_document_simple()
    
    if test1_passed:
        print("\n" + "=" * 50)
        print("Test 2: Full HackRX request with 10 questions")
        test2_passed = test_full_hackrx_request()
    else:
        print("\nSkipping full test due to simple test failure")
        test2_passed = False
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Simple URL Test: {'PASSED' if test1_passed else 'FAILED'}")
    print(f"Full HackRX Test: {'PASSED' if test2_passed else 'FAILED'}")

if __name__ == "__main__":
    main()
