"""
Data & Labeling Module
Prepares training dataset from MongoDB expenses collection
"""

import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
import json
from typing import Dict, List, Tuple
import os

# Try to import config, fallback to defaults
try:
    from config import MONGODB_URI, MONGODB_DB_NAME
except ImportError:
    # If config not available, use defaults
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "expense_db")


class DataLabelingModule:
    """Handles data extraction, cleaning, and train/test splitting"""
    
    def __init__(self, mongo_uri: str = None, 
                 db_name: str = None):
        """
        Initialize the data labeling module
        
        Args:
            mongo_uri: MongoDB connection string (defaults to config/env)
            db_name: Database name (defaults to config/env)
        """
        self.mongo_uri = mongo_uri or MONGODB_URI
        self.db_name = db_name or MONGODB_DB_NAME
        self.client = None
        self.db = None
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client[self.db_name]
            print(f"Connected to MongoDB: {self.db_name}")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def export_expenses(self, collection_name: str = "expenses", 
                       output_file: str = "data/expenses_raw.json") -> pd.DataFrame:
        """
        Export expenses from MongoDB to DataFrame
        
        Args:
            collection_name: Name of the expenses collection
            output_file: Path to save raw data (optional)
            
        Returns:
            DataFrame with expenses data
        """
        if not self.db:
            self.connect()
        
        collection = self.db[collection_name]
        
        # Fetch all expenses with required fields
        expenses = list(collection.find({
            "description": {"$exists": True, "$ne": ""},
            "category": {"$exists": True, "$ne": ""},
            "amount": {"$exists": True, "$type": "number"}
        }))
        
        if not expenses:
            print("Warning: No expenses found in database")
            return pd.DataFrame()
        
        # Convert to DataFrame
        df = pd.DataFrame(expenses)
        
        # Save raw data
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        df.to_json(output_file, orient='records', indent=2)
        print(f"Exported {len(df)} expenses to {output_file}")
        
        return df
    
    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean the expenses data
        
        Args:
            df: Raw DataFrame
            
        Returns:
            Cleaned DataFrame
        """
        # Create a copy
        df_clean = df.copy()
        
        # Remove rows with missing essential fields
        df_clean = df_clean.dropna(subset=['description', 'category', 'amount'])
        
        # Remove empty descriptions
        df_clean = df_clean[df_clean['description'].str.strip() != '']
        
        # Ensure amount is positive
        df_clean = df_clean[df_clean['amount'] > 0]
        
        # Convert description to string and strip whitespace
        df_clean['description'] = df_clean['description'].astype(str).str.strip()
        
        # Convert category to string
        df_clean['category'] = df_clean['category'].astype(str).str.strip()
        
        # Remove duplicates based on description and category
        df_clean = df_clean.drop_duplicates(subset=['description', 'category'], keep='first')
        
        print(f"Cleaned data: {len(df)} -> {len(df_clean)} records")
        
        return df_clean
    
    def split_train_test(self, df: pd.DataFrame, test_size: float = 0.2, 
                        random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Split data into train and test sets
        
        Args:
            df: Cleaned DataFrame
            test_size: Proportion of test set
            random_state: Random seed
            
        Returns:
            Tuple of (train_df, test_df)
        """
        # Stratified split to maintain category distribution
        train_df, test_df = train_test_split(
            df,
            test_size=test_size,
            random_state=random_state,
            stratify=df['category']
        )
        
        print(f"Train set: {len(train_df)} records")
        print(f"Test set: {len(test_df)} records")
        print(f"\nCategory distribution in train set:")
        print(train_df['category'].value_counts())
        
        return train_df, test_df
    
    def save_datasets(self, train_df: pd.DataFrame, test_df: pd.DataFrame,
                     train_path: str = "data/train.json",
                     test_path: str = "data/test.json"):
        """
        Save train and test datasets to JSON files
        
        Args:
            train_df: Training DataFrame
            test_df: Test DataFrame
            train_path: Path to save training data
            test_path: Path to save test data
        """
        os.makedirs(os.path.dirname(train_path), exist_ok=True)
        
        train_df.to_json(train_path, orient='records', indent=2)
        test_df.to_json(test_path, orient='records', indent=2)
        
        print(f"Saved training data to {train_path}")
        print(f"Saved test data to {test_path}")


def create_labeling_script():
    """
    Example function to create a simple labeling tool script
    This can be run interactively to label unlabeled expenses
    """
    script_content = '''"""
Simple Labeling Tool Script
Run this to manually label expenses that don't have categories
"""

import pymongo
from data_labeling import DataLabelingModule

# Connect to database
labeler = DataLabelingModule()
labeler.connect()

# Get unlabeled expenses
collection = labeler.db["expenses"]
unlabeled = list(collection.find({
    "$or": [
        {"category": {"$exists": False}},
        {"category": ""},
        {"category": None}
    ]
}))

print(f"Found {len(unlabeled)} unlabeled expenses")

# Categories and their jar mappings
CATEGORIES = {
    "Food": "NEC",
    "Transportation": "NEC",
    "Bills": "NEC",
    "Shopping": "NEC",
    "Entertainment": "PLAY",
    "Travel": "PLAY",
    "Education": "EDU",
    "Books": "EDU",
    "Savings": "LTSS",
    "Investment": "LTSS",
    "Donation": "GIVE",
    "Emergency": "FFA"
}

# Interactive labeling
for expense in unlabeled:
    print(f"\\nDescription: {expense['description']}")
    print(f"Amount: {expense['amount']}")
    print("Available categories:", list(CATEGORIES.keys()))
    
    category = input("Enter category (or 'skip'): ").strip()
    
    if category.lower() == 'skip':
        continue
    
    if category in CATEGORIES:
        collection.update_one(
            {"_id": expense["_id"]},
            {
                "$set": {
                    "category": category,
                    "jarKey": CATEGORIES[category]
                }
            }
        )
        print(f"Labeled as: {category} -> {CATEGORIES[category]}")
    else:
        print("Invalid category, skipping...")

labeler.disconnect()
print("\\nLabeling complete!")
'''
    
    with open("ai-service/scripts/label_expenses.py", "w", encoding="utf-8") as f:
        f.write(script_content)
    
    print("Created labeling script at: ai-service/scripts/label_expenses.py")


if __name__ == "__main__":
    # Example usage
    labeler = DataLabelingModule()
    labeler.connect()
    
    # Export and clean data
    df_raw = labeler.export_expenses()
    df_clean = labeler.clean_data(df_raw)
    
    # Split into train/test
    train_df, test_df = labeler.split_train_test(df_clean)
    
    # Save datasets
    labeler.save_datasets(train_df, test_df)
    
    labeler.disconnect()
    
    # Create labeling script
    create_labeling_script()

