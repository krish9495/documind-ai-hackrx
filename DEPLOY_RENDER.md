# Render Deployment Guide for DocuMind AI

## Deploy to Render (Free):

1. **Go to:** https://render.com
2. **Create New Web Service**
3. **Connect your GitHub repo**
4. **Settings:**

   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables:**

   - `GOOGLE_API_KEY`: Your Google AI API key

6. **Your webhook URL will be:**
   ```
   https://your-app-name.onrender.com/api/v1/hackrx/run
   ```
