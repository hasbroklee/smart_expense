"""
Naive Bayes Classification Module
Trains and evaluates a MultinomialNB classifier for expense categorization
"""

import joblib
import numpy as np
import pandas as pd
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_recall_fscore_support
from typing import Dict, List, Tuple, Optional
import os
import json

# Import AmountExtractor - handle both relative and absolute imports
try:
    from .text_preprocessing import AmountExtractor
except ImportError:
    from modules.text_preprocessing import AmountExtractor


# Category to JarKey mapping (6 Jars financial model)
CATEGORY_TO_JAR = {
    # NEC (Necessities) - Essential expenses
    "Food": "NEC",
    "Groceries": "NEC",
    "Transportation": "NEC",
    "Bills": "NEC",
    "Utilities": "NEC",
    "Rent": "NEC",
    "Healthcare": "NEC",
    "Shopping": "NEC",
    "Clothing": "NEC",
    
    # FFA (Financial Freedom Account) - Emergency fund
    "Emergency": "FFA",
    "Insurance": "FFA",
    "Savings": "FFA",
    
    # LTSS (Long Term Savings for Spending) - Big purchases
    "Investment": "LTSS",
    "LongTermSavings": "LTSS",
    "House": "LTSS",
    "Car": "LTSS",
    
    # EDU (Education) - Learning and growth
    "Education": "EDU",
    "Books": "EDU",
    "Course": "EDU",
    "Training": "EDU",
    
    # PLAY (Play) - Fun and entertainment
    "Entertainment": "PLAY",
    "Travel": "PLAY",
    "Hobby": "PLAY",
    "Movies": "PLAY",
    "Restaurant": "PLAY",
    
    # GIVE (Give) - Charity and giving
    "Donation": "GIVE",
    "Charity": "GIVE",
    "Gift": "GIVE"
}

# Categories / keywords considered as INCOME
INCLUDE_INCOME_CATEGORIES = {
    "Income",
    "Salary",
    "Wage",
    "Bonus",
    "Commission",
    "Interest",
    "Dividend",
    "Gift",
}

INCOME_KEYWORDS = {
    "luong",
    "lương",
    "thu nhap",
    "thu nhập",
    "salary",
    "income",
    "bonus",
    "thưởng",
    "hoa hồng",
    "commission",
    "lãi",
    "interest",
    "dividend",
    "thưởng tết",
    "tiền thưởng",
}


class ExpenseClassifier:
    """Naive Bayes classifier for expense categorization"""
    
    def __init__(self):
        """Initialize the classifier"""
        self.model = MultinomialNB(alpha=1.0)  # Laplace smoothing
        self.is_trained = False
        self.categories = None
        self.category_to_jar = CATEGORY_TO_JAR
    
    def train(self, X_train: np.ndarray, y_train: List[str]):
        """
        Train the Naive Bayes classifier
        
        Args:
            X_train: TF-IDF vectors for training
            y_train: Category labels
        """
        # Get unique categories
        self.categories = sorted(list(set(y_train)))
        
        # Train the model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        print(f"Trained classifier on {len(y_train)} samples")
        print(f"Number of categories: {len(self.categories)}")
        print(f"Categories: {self.categories}")
    
    def predict(self, X: np.ndarray) -> List[str]:
        """
        Predict categories for given vectors
        
        Args:
            X: TF-IDF vectors
            
        Returns:
            List of predicted categories
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        return self.model.predict(X).tolist()
    
    def _infer_type(self, category: str, description: Optional[str] = None) -> str:
        """Infer transaction type (INCOME or EXPENSE) from category and description."""
        # First try by explicit income categories
        if category in INCLUDE_INCOME_CATEGORIES:
            return "INCOME"

        # Fallback: keyword search in description
        if description:
            text = description.lower()
            for kw in INCOME_KEYWORDS:
                if kw in text:
                    return "INCOME"

        # Default to EXPENSE if not matched
        return "EXPENSE"

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        Predict category probabilities
        
        Args:
            X: TF-IDF vectors
            
        Returns:
            Probability matrix (n_samples, n_categories)
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        return self.model.predict_proba(X)
    
    def predict_single(self, X: np.ndarray, description: Optional[str] = None, 
                      amount: Optional[float] = None) -> Dict:
        """
        Predict category for a single expense with confidence and extract amount
        
        Args:
            X: Single TF-IDF vector (shape: (1, n_features))
            description: Original text description (for amount extraction)
            amount: Optional pre-provided amount (if None, will try to extract from description)
            
        Returns:
            Dictionary with predictedCategory, predictedJarKey, confidence, and amount
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        # Get prediction
        predicted_category = self.predict(X)[0]
        
        # Get probabilities
        probabilities = self.predict_proba(X)[0]
        category_idx = self.categories.index(predicted_category)
        confidence = float(probabilities[category_idx])
        
        # Map to jar key
        predicted_jar = self.category_to_jar.get(predicted_category, "NEC")

        # Infer type (INCOME vs EXPENSE)
        predicted_type = self._infer_type(predicted_category, description)
        
        # Extract amount if not provided
        extracted_amount = amount
        if extracted_amount is None and description:
            extracted_amount = AmountExtractor.extract_amount(description)
        
        result = {
            "predictedCategory": predicted_category,
            "predictedJarKey": predicted_jar,
            "predictedType": predicted_type,
            "confidence": round(confidence, 4)
        }
        
        if extracted_amount is not None:
            result["amount"] = float(extracted_amount)
        
        return result
    
    def evaluate(self, X_test: np.ndarray, y_test: List[str]) -> Dict:
        """
        Evaluate the classifier
        
        Args:
            X_test: Test TF-IDF vectors
            y_test: True category labels
            
        Returns:
            Dictionary with evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")
        
        # Predictions
        y_pred = self.predict(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, support = precision_recall_fscore_support(
            y_test, y_pred, average='weighted', zero_division=0
        )
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred, labels=self.categories)
        
        # Classification report
        report = classification_report(y_test, y_pred, labels=self.categories, 
                                     output_dict=True, zero_division=0)
        
        results = {
            "accuracy": round(accuracy, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm.tolist(),
            "categories": self.categories,
            "classification_report": report
        }
        
        print("\n" + "="*50)
        print("CLASSIFICATION EVALUATION RESULTS")
        print("="*50)
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        print("\nConfusion Matrix:")
        print(cm)
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, labels=self.categories, zero_division=0))
        
        return results
    
    def save(self, filepath: str = "models/classifier_nb.pkl"):
        """
        Save the trained model to disk
        
        Args:
            filepath: Path to save the model
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Save model
        joblib.dump(self.model, filepath)
        
        # Save metadata (categories and mapping)
        metadata = {
            "categories": self.categories,
            "category_to_jar": self.category_to_jar
        }
        metadata_path = filepath.replace(".pkl", "_metadata.json")
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"Saved classifier to {filepath}")
        print(f"Saved metadata to {metadata_path}")
    
    def load(self, filepath: str = "models/classifier_nb.pkl"):
        """
        Load the trained model from disk
        
        Args:
            filepath: Path to load the model from
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        
        # Load model
        self.model = joblib.load(filepath)
        
        # Load metadata
        metadata_path = filepath.replace(".pkl", "_metadata.json")
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
            self.categories = metadata.get("categories")
            self.category_to_jar = metadata.get("category_to_jar", CATEGORY_TO_JAR)
        else:
            print("Warning: Metadata file not found, using default category mapping")
        
        self.is_trained = True
        print(f"Loaded classifier from {filepath}")


if __name__ == "__main__":
    # Example usage (requires training data)
    print("This module should be used with training data from data_labeling module")
    print("Example training workflow:")
    print("1. Load train/test data")
    print("2. Preprocess and vectorize with TFIDFVectorizer")
    print("3. Train classifier")
    print("4. Evaluate on test set")
    print("5. Save model")
