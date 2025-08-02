FROM python:3.11-slim
WORKDIR /app
# Copy requirements first for better caching
COPY requirements.txt .
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Copy the rest of the application
COPY . .
# Create uploads directory
RUN mkdir -p uploads
# Expose port
EXPOSE $PORT
# Start the application
CMD ["python", "-m", "uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "$PORT"]
