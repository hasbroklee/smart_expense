# AI Service - Expense Classification

This AI service provides automatic expense classification using TF-IDF + Naive Bayes.

## Quick Start - Test the Model

### Option 1: Demo Test (No MongoDB required)

For quick testing without setting up MongoDB:

```bash
cd ai-service
python demo_test.py
```

This will:
1. Create a demo model with sample data
2. Allow you to enter expense descriptions interactively
3. Show predicted category, jar key, and confidence

### Option 2: Full Test (Requires MongoDB)

If you have MongoDB with expense data:

1. **Train the model first:**
```bash
python train_model.py
```

2. **Test interactively:**
```bash
python test_model.py
```

## Usage Examples

When you run the test script, you can enter descriptions like:

```
Enter expense description: Mua đồ ăn tại siêu thị
Enter amount (optional, press Enter to skip): 150000

Description: Mua đồ ăn tại siêu thị
Amount: $150,000.00
Predicted Category: Food
Predicted Jar: NEC
Confidence: 85.23%
```

## Module Structure

- `modules/data_labeling.py` - Data extraction and preparation
- `modules/text_preprocessing.py` - Text cleaning and TF-IDF vectorization
- `modules/classification.py` - Naive Bayes classifier
- `modules/anomaly_detection.py` - Anomaly detection (for future use)
- `train_model.py` - Training script
- `test_model.py` - Interactive test script
- `demo_test.py` - Demo test with sample data

## Requirements

Install dependencies:

```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file in the `ai-service` directory (optional):

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=expense_db
AI_SERVICE_PORT=8000
ANOMALY_THRESHOLD=2.5
LOOKBACK_DAYS=30
```

If `.env` is not provided, defaults will be used. MongoDB connection is only needed for:
- Training models from MongoDB data (`train_model.py`)
- Anomaly detection (if used via API)

For demo/testing without MongoDB, use `demo_test.py` which doesn't require MongoDB.

## 6 Jars Financial Model

Categories are mapped to jars:
- **NEC** (Necessities): Food, Transportation, Bills, Shopping
- **FFA** (Financial Freedom Account): Emergency, Insurance, Savings
- **LTSS** (Long Term Savings): Investment, House, Car
- **EDU** (Education): Education, Books, Courses
- **PLAY** (Play): Entertainment, Travel, Hobby
- **GIVE** (Give): Donation, Charity, Gifts

