#!/usr/bin/env python3
"""
Render Deployment Guide for DocuMind AI
=======================================

🚀 DEPLOY TO RENDER (FREE)

1. PREPARE REPOSITORY:
   ✅ All files are ready in this repository
   ✅ requirements.txt configured for Render
   ✅ Railway files cleaned up

2. DEPLOY TO RENDER:
   • Go to: https://render.com
   • Sign up with GitHub account
   • Click "New +" → "Web Service"
   • Connect GitHub repository: documind-ai-hackrx
   
3. RENDER CONFIGURATION:
   • Name: documind-ai-hackrx
   • Environment: Python 3
   • Build Command: pip install -r requirements.txt
   • Start Command: uvicorn api_server:app --host 0.0.0.0 --port $PORT
   • Instance Type: Free

4. ENVIRONMENT VARIABLES:
   Add this in Render dashboard:
   • GOOGLE_API_KEY = [YOUR_GOOGLE_API_KEY_HERE]

5. YOUR WEBHOOK URL WILL BE:
   https://documind-ai-hackrx.onrender.com/api/v1/hackrx/run

6. TEST DEPLOYMENT:
   Update test_deployed.py with your Render URL and run:
   python test_deployed.py

🎯 HACKRX SUBMISSION:
   Submit webhook URL: https://your-app.onrender.com/api/v1/hackrx/run
"""

import sys
print(__doc__)

if __name__ == "__main__":
    print("📝 Ready for Render deployment!")
    print("🔗 Go to: https://render.com")
