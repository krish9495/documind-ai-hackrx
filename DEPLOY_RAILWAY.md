# Railway Deployment Guide for DocuMind AI

## Quick Deploy to Railway:

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**

   ```bash
   railway login
   ```

3. **Deploy from this directory:**

   ```bash
   railway deploy
   ```

4. **Your webhook URL will be:**
   ```
   https://your-app-name.railway.app/api/v1/hackrx/run
   ```

## Environment Variables to Set in Railway:

- `GOOGLE_API_KEY`: Your Google AI API key
- `PORT`: 8000 (Railway will set this automatically)

## Alternative: One-Click Deploy

Visit: https://railway.app
Connect your GitHub repo and deploy instantly!
