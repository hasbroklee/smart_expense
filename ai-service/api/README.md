# Expense Classification API

FastAPI service for expense classification using TF-IDF + Naive Bayes.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r ../requirements.txt
```

### 2. Train Models (if not already trained)

```bash
cd ..
python demo_test.py  # This will create demo models
# OR
python train_model.py  # If you have MongoDB data
```

### 3. Run the API

```bash
# From the project root
python run_api.py

# OR from the api directory
cd api
python main.py
```

The API will start at: `http://localhost:8000`

## API Endpoints

### 1. Health Check
```
GET /health
```

### 2. Classify Single Expense
```
POST /classify-expense
```

**Request Body:**
```json
{
    "description": "Mua đồ ăn 150000 đồng",
    "userId": "user123",
    "amount": null  // optional, will be extracted from text
}
```

**Response:**
```json
{
    "predictedCategory": "Food",
    "predictedJarKey": "NEC",
    "confidence": 0.8523,
    "amount": 150000.0,
    "success": true
}
```

### 3. Classify Batch Expenses
```
POST /classify-batch
```

**Request Body:**
```json
[
    {
        "description": "Mua đồ ăn 150000",
        "userId": "user123"
    },
    {
        "description": "Buy groceries $200",
        "userId": "user123"
    }
]
```

## API Documentation

Once the API is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Example Usage with curl

```bash
# Classify an expense
curl -X POST "http://localhost:8000/classify-expense" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Mua đồ ăn 150000 đồng",
    "userId": "user123"
  }'
```

## Example Usage with Python

```python
import requests

response = requests.post(
    "http://localhost:8000/classify-expense",
    json={
        "description": "Mua đồ ăn 150000 đồng",
        "userId": "user123"
    }
)

result = response.json()
print(f"Category: {result['predictedCategory']}")
print(f"Jar: {result['predictedJarKey']}")
print(f"Amount: {result['amount']}")
print(f"Confidence: {result['confidence']}")
```

