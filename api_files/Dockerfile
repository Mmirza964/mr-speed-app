FROM python:3.9-slim

WORKDIR /api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


CMD ["uvicorn", "api_files.main:app", "--host", "0.0.0.0", "--port", "8000"]