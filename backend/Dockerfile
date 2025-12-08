# Build a backend image targeted for ARM (AKS nodes are arm64)
# NOTE: platform will be enforced in GitHub Actions build,
# but this base is a normal Python image.
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose backend port
EXPOSE 8080

# Start FastAPI app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
