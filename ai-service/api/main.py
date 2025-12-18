"""
FastAPI Service for Expense Classification
Exposes HTTP API endpoints for expense classification and inference
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import os
import sys

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import modules
from modules.text_preprocessing import TFIDFVectorizer
from modules.classification import ExpenseClassifier

# Initialize FastAPI app
app = FastAPI(
    title="Expense Classification API",
    description="AI service for automatic expense classification using TF-IDF + Naive Bayes",
    version="1.0.0"
)

# Global variables for loaded models
tfidf_vectorizer = None
classifier = None


class ExpenseRequest(BaseModel):
    """Request model for expense classification"""
    description: str = Field(..., description="Expense description text")
    amount: Optional[float] = Field(None, description="Expense amount (optional, will be extracted from text if not provided)")
    userId: str = Field(..., description="User ID")


class ClassificationResponse(BaseModel):
    """Response model for expense classification"""
    predictedCategory: str = Field(..., description="Predicted expense category")
    predictedJarKey: str = Field(..., description="Predicted jar key (NEC, FFA, LTSS, EDU, PLAY, GIVE)")
    predictedType: str = Field(..., description="Predicted transaction type (EXPENSE or INCOME)")
    confidence: float = Field(..., description="Confidence score (0-1)")
    amount: Optional[float] = Field(None, description="Extracted or provided amount")
    success: bool = Field(True, description="Whether the classification was successful")


def load_models():
    """Load TF-IDF vectorizer and classifier models"""
    global tfidf_vectorizer, classifier
    
    if tfidf_vectorizer is None or classifier is None:
        try:
            # Try to import from config, fallback to default path
            try:
                from config import TFIDF_MODEL_PATH, CLASSIFIER_MODEL_PATH
                tfidf_path = TFIDF_MODEL_PATH
                classifier_path = CLASSIFIER_MODEL_PATH
            except ImportError:
                # Fallback to default path
                models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
                tfidf_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
                classifier_path = os.path.join(models_dir, "classifier_nb.pkl")
            
            # Load TF-IDF vectorizer
            tfidf_vectorizer = TFIDFVectorizer()
            if not os.path.exists(tfidf_path):
                raise FileNotFoundError(f"TF-IDF model not found at {tfidf_path}. Please train the model first.")
            tfidf_vectorizer.load(tfidf_path)
            
            # Load classifier
            classifier = ExpenseClassifier()
            if not os.path.exists(classifier_path):
                raise FileNotFoundError(f"Classifier model not found at {classifier_path}. Please train the model first.")
            classifier.load(classifier_path)
            
            print("Models loaded successfully!")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            raise


@app.on_event("startup")
async def startup_event():
    """Load models when the API starts"""
    print("Starting Expense Classification API...")
    try:
        load_models()
        print("API ready!")
    except Exception as e:
        print(f"Warning: Could not load models on startup: {e}")
        print("API will attempt to load models on first request.")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Expense Classification API",
        "version": "1.0.0",
        "endpoints": {
            "classify": "POST /classify-expense",
            "health": "GET /health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    models_loaded = tfidf_vectorizer is not None and classifier is not None
    return {
        "status": "healthy" if models_loaded else "degraded",
        "models_loaded": models_loaded
    }


@app.post("/classify-expense", response_model=ClassificationResponse)
async def classify_expense(request: ExpenseRequest):
    """
    Classify an expense based on description
    
    This endpoint:
    1. Extracts amount from description if not provided
    2. Classifies the expense category
    3. Maps category to jar key (6 Jars financial model)
    4. Returns prediction with confidence score
    
    Example request:
    ```json
    {
        "description": "Mua đồ ăn 150000 đồng",
        "userId": "user123"
    }
    ```
    
    Example response:
    ```json
    {
        "predictedCategory": "Food",
        "predictedJarKey": "NEC",
        "confidence": 0.8523,
        "amount": 150000.0,
        "success": true
    }
    ```
    """
    # Ensure models are loaded
    if tfidf_vectorizer is None or classifier is None:
        try:
            load_models()
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Models not available: {str(e)}. Please train the models first."
            )
    
    try:
        # Transform description to TF-IDF vector
        description_vector = tfidf_vectorizer.transform([request.description])
        
        # Get prediction with amount extraction and type inference
        result = classifier.predict_single(
            description_vector,
            description=request.description,
            amount=request.amount
        )
        
        # Build response
        response = ClassificationResponse(
            predictedCategory=result["predictedCategory"],
            predictedJarKey=result["predictedJarKey"],
            predictedType=result.get("predictedType", "EXPENSE"),
            confidence=result["confidence"],
            amount=result.get("amount"),
            success=True
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during classification: {str(e)}"
        )


@app.post("/classify-batch")
async def classify_batch(requests: list[ExpenseRequest]):
    """
    Classify multiple expenses in batch
    
    Example request:
    ```json
    [
        {"description": "Mua đồ ăn 150000", "userId": "user123"},
        {"description": "Buy groceries $200", "userId": "user123"}
    ]
    ```
    """
    # Ensure models are loaded
    if tfidf_vectorizer is None or classifier is None:
        try:
            load_models()
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Models not available: {str(e)}"
            )
    
    results = []
    
    for request in requests:
        try:
            # Transform description to TF-IDF vector
            description_vector = tfidf_vectorizer.transform([request.description])
            
            # Get prediction
            result = classifier.predict_single(
                description_vector,
                description=request.description,
                amount=request.amount
            )
            
            results.append({
                "description": request.description,
                "userId": request.userId,
                "predictedCategory": result["predictedCategory"],
                "predictedJarKey": result["predictedJarKey"],
                "predictedType": result.get("predictedType", "EXPENSE"),
                "confidence": result["confidence"],
                "amount": result.get("amount"),
                "success": True
            })
        except Exception as e:
            results.append({
                "description": request.description,
                "userId": request.userId,
                "error": str(e),
                "success": False
            })
    
    return {
        "results": results,
        "total": len(requests),
        "successful": sum(1 for r in results if r.get("success", False))
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the API
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

