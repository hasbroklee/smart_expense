"""
Configuration file for AI Service
Loads environment variables and provides configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "test")

# AI Service Configuration
AI_SERVICE_HOST = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))

# Model Paths
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
TFIDF_MODEL_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
CLASSIFIER_MODEL_PATH = os.path.join(MODELS_DIR, "classifier_nb.pkl")

# Anomaly Detection Configuration
ANOMALY_THRESHOLD = float(os.getenv("ANOMALY_THRESHOLD", "2.5"))
LOOKBACK_DAYS = int(os.getenv("LOOKBACK_DAYS", "30"))

