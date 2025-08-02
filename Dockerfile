FROM python:3.11-alpine
WORKDIR /app
# Install minimal system deps
RUN apk add --no-cache gcc musl-dev
# Install only essential packages
COPY requirements.txt .
RUN pip install --no-cache-dir fastapi uvicorn python-dotenv google-generativeai requests
# Copy only essential files
COPY api_server.py .
COPY advanced_rag_system.py .
COPY .env .
# Create uploads dir
RUN mkdir -p uploads
# Clean up
RUN apk del gcc musl-dev
EXPOSE $PORT
CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "$PORT"]
