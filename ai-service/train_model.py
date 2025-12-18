"""
Training Script
Trains the TF-IDF vectorizer and Naive Bayes classifier
Run this first to train the models before using the test script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.data_labeling import DataLabelingModule
from modules.text_preprocessing import TFIDFVectorizer
from modules.classification import ExpenseClassifier
import pandas as pd
import json


def train_models():
    """Main training function"""
    print("="*60)
    print("TRAINING EXPENSE CLASSIFICATION MODELS")
    print("="*60)
    
    # Step 1: Load and prepare data
    print("\n[Step 1] Loading and preparing data...")
    labeler = DataLabelingModule()
    labeler.connect()
    
    # Export expenses
    df_raw = labeler.export_expenses()
    
    if len(df_raw) == 0:
        print("\nERROR: No expenses found in database!")
        print("Please add some expenses with categories first.")
        print("\nExample expense document:")
        print({
            "description": "Mua đồ ăn tại siêu thị",
            "amount": 150000,
            "category": "Food",
            "jarKey": "NEC",
            "userId": "user123"
        })
        labeler.disconnect()
        return
    
    # Clean data
    df_clean = labeler.clean_data(df_raw)
    
    if len(df_clean) < 10:
        print(f"\nWARNING: Only {len(df_clean)} clean records found.")
        print("You need at least 10-20 records for meaningful training.")
        print("Consider adding more labeled expenses.")
    
    # Split train/test
    train_df, test_df = labeler.split_train_test(df_clean, test_size=0.2)
    labeler.save_datasets(train_df, test_df)
    labeler.disconnect()
    
    # Step 2: Preprocess and vectorize
    print("\n[Step 2] Preprocessing and vectorizing text...")
    tfidf = TFIDFVectorizer(max_features=5000, min_df=2, max_df=0.95)
    
    # Get descriptions
    train_descriptions = train_df['description'].tolist()
    test_descriptions = test_df['description'].tolist()
    
    # Fit and transform
    X_train = tfidf.fit_transform(train_descriptions)
    X_test = tfidf.transform(test_descriptions)
    
    # Save vectorizer
    tfidf.save("models/tfidf_vectorizer.pkl")
    
    # Step 3: Train classifier
    print("\n[Step 3] Training Naive Bayes classifier...")
    classifier = ExpenseClassifier()
    
    y_train = train_df['category'].tolist()
    y_test = test_df['category'].tolist()
    
    classifier.train(X_train, y_train)
    
    # Step 4: Evaluate
    print("\n[Step 4] Evaluating model...")
    results = classifier.evaluate(X_test, y_test)
    
    # Step 5: Save model
    print("\n[Step 5] Saving model...")
    classifier.save("models/classifier_nb.pkl")
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print(f"Model accuracy: {results['accuracy']:.2%}")
    print(f"Models saved to: models/")
    print("\nYou can now use test_model.py to test the classifier.")


if __name__ == "__main__":
    train_models()

