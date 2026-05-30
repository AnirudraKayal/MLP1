FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements_prod.txt .
RUN pip install --no-cache-dir -r requirements_prod.txt

# Copy application files
COPY . .

# Hugging Face Spaces exposes port 7860
EXPOSE 7860

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
