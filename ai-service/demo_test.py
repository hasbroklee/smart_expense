"""
Demo Test Script
Quick test with sample data (no MongoDB required)
This creates a minimal model for demonstration
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.text_preprocessing import TFIDFVectorizer, AmountExtractor
from modules.classification import ExpenseClassifier
import numpy as np
import pandas as pd


def create_sample_data():
    """Create sample training data"""
    sample_data = [
        {"description": "Mua đồ ăn tại siêu thị 150000 đồng", "category": "Food", "amount": 150000},
        {"description": "Buy groceries at supermarket $200", "category": "Food", "amount": 200000},
        {"description": "Thanh toán hóa đơn điện 500000", "category": "Bills", "amount": 500000},
        {"description": "Pay electricity bill 600000 VND", "category": "Bills", "amount": 600000},
        {"description": "Mua vé xem phim 200k", "category": "Entertainment", "amount": 200000},
        {"description": "Buy movie tickets $250", "category": "Entertainment", "amount": 250000},
        {"description": "Đi taxi về nhà 100000 đồng", "category": "Transportation", "amount": 100000},
        {"description": "Taxi ride home 120k", "category": "Transportation", "amount": 120000},
        {"description": "Mua sách học 300.000", "category": "Education", "amount": 300000},
        {"description": "Buy books for study 350000", "category": "Education", "amount": 350000},
        {"description": "Quyên góp từ thiện 500000 VNĐ", "category": "Donation", "amount": 500000},
        {"description": "Charity donation $600", "category": "Donation", "amount": 600000},
        {"description": "Mua quần áo 800000", "category": "Shopping", "amount": 800000},
        {"description": "Buy clothes 900k", "category": "Shopping", "amount": 900000},
        {"description": "Đi du lịch 5.000.000 đồng", "category": "Travel", "amount": 5000000},
        {"description": "Travel vacation $6000", "category": "Travel", "amount": 6000000},
        {"description": "Tiết kiệm 2000000", "category": "Savings", "amount": 2000000},
        {"description": "Save money 2500k", "category": "Savings", "amount": 2500000},
        {"description": "Mua đồ chơi 150000", "category": "Entertainment", "amount": 150000},
        {"description": "Buy toys $180", "category": "Entertainment", "amount": 180000},
        # Add some without amounts for variety
        {"description": "Mua đồ ăn tại siêu thị", "category": "Food", "amount": 150000},
        {"description": "Buy groceries", "category": "Food", "amount": 200000},
        {"description": "Thanh toán hóa đơn", "category": "Bills", "amount": 500000},
        {"description": "Pay bill", "category": "Bills", "amount": 600000},
    ]
    
    return pd.DataFrame(sample_data)


def train_demo_model():
    """Train a demo model with sample data"""
    print("Creating demo model with sample data...")
    
    # Create sample data
    df = create_sample_data()
    
    # Initialize vectorizer
    tfidf = TFIDFVectorizer(max_features=1000, min_df=1)
    
    # Fit and transform
    descriptions = df['description'].tolist()
    X = tfidf.fit_transform(descriptions)
    
    # Train classifier
    classifier = ExpenseClassifier()
    y = df['category'].tolist()
    classifier.train(X, y)
    
    # Save models
    os.makedirs("models", exist_ok=True)
    tfidf.save("models/tfidf_vectorizer.pkl")
    classifier.save("models/classifier_nb.pkl")
    
    print("Demo model trained and saved!\n")
    return tfidf, classifier


def test_interactive(tfidf, classifier):
    """Interactive testing"""
    print("="*60)
    print("EXPENSE CLASSIFICATION TEST")
    print("="*60)
    print()
    print("Enter expense descriptions to classify.")
    print("The system will automatically extract amount from text if present.")
    print("Examples: 'Mua đồ ăn 150000 đồng', 'Buy groceries $150', 'Thanh toán 500.000 VNĐ'")
    print("Type 'quit' or 'exit' to stop.\n")
    
    while True:
        try:
            # Get description
            description = input("Enter expense description: ").strip()
            
            if description.lower() in ['quit', 'exit', 'q']:
                print("\nGoodbye!")
                break
            
            if not description:
                print("Please enter a description.\n")
                continue
            
            # Predict
            print("\n" + "-"*60)
            description_vector = tfidf.transform([description])
            result = classifier.predict_single(description_vector, description=description)
            
            print(f"Description: {description}")
            
            # Show extracted amount
            if 'amount' in result:
                print(f"Extracted Amount: {result['amount']:,.0f}")
            else:
                print("Extracted Amount: Not found in text")
            
            print(f"Predicted Category: {result['predictedCategory']}")
            print(f"Predicted Jar: {result['predictedJarKey']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print("-"*60)
            print()
            
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {e}\n")
            import traceback
            traceback.print_exc()
            continue


def main():
    """Main function"""
    # Check if models exist
    if os.path.exists("models/tfidf_vectorizer.pkl") and os.path.exists("models/classifier_nb.pkl"):
        print("Loading existing models...")
        tfidf = TFIDFVectorizer()
        tfidf.load("models/tfidf_vectorizer.pkl")
        
        classifier = ExpenseClassifier()
        classifier.load("models/classifier_nb.pkl")
        print("Models loaded!\n")
    else:
        print("No models found. Training demo model...")
        tfidf, classifier = train_demo_model()
    
    # Run interactive test
    test_interactive(tfidf, classifier)


if __name__ == "__main__":
    main()

