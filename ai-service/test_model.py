"""
Simple Test Script
Interactive script to test expense classification
Enter a description and amount, get back category and jar key
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.text_preprocessing import TFIDFVectorizer, AmountExtractor
from modules.classification import ExpenseClassifier
import numpy as np


def load_models():
    """Load trained models"""
    print("Loading models...")
    
    # Load TF-IDF vectorizer
    tfidf = TFIDFVectorizer()
    try:
        tfidf.load("models/tfidf_vectorizer.pkl")
    except FileNotFoundError:
        print("ERROR: TF-IDF vectorizer not found!")
        print("Please run train_model.py first to train the models.")
        return None, None
    
    # Load classifier
    classifier = ExpenseClassifier()
    try:
        classifier.load("models/classifier_nb.pkl")
    except FileNotFoundError:
        print("ERROR: Classifier model not found!")
        print("Please run train_model.py first to train the models.")
        return None, None
    
    print("Models loaded successfully!\n")
    return tfidf, classifier


def predict_expense(tfidf, classifier, description, amount=None):
    """
    Predict category and jar for an expense
    
    Args:
        tfidf: TF-IDF vectorizer
        classifier: Trained classifier
        description: Expense description text
        amount: Expense amount (optional, will extract from text if not provided)
    
    Returns:
        Dictionary with prediction results
    """
    # Transform description to TF-IDF vector
    description_vector = tfidf.transform([description])
    
    # Get prediction with amount extraction
    result = classifier.predict_single(description_vector, description=description, amount=amount)
    
    return result


def main():
    """Main interactive loop"""
    print("="*60)
    print("EXPENSE CLASSIFICATION TEST")
    print("="*60)
    print()
    
    # Load models
    tfidf, classifier = load_models()
    if tfidf is None or classifier is None:
        return
    
    print("Enter expense descriptions to classify.")
    print("The system will automatically extract amount from text if present.")
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
            
            # Predict (amount will be extracted automatically)
            print("\n" + "-"*60)
            result = predict_expense(tfidf, classifier, description)
            
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
            continue


if __name__ == "__main__":
    main()

