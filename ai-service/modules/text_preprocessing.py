"""
Text Preprocessing & TF-IDF Module
Handles text cleaning, tokenization, and TF-IDF vectorization
"""

import re
import string
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Tuple
import os

# Vietnamese stopwords (common words)
VIETNAMESE_STOPWORDS = {
    'và', 'của', 'cho', 'với', 'từ', 'trong', 'được', 'là', 'một', 'có',
    'đã', 'sẽ', 'này', 'đó', 'về', 'khi', 'nếu', 'như', 'theo', 'đến',
    'các', 'những', 'mà', 'để', 'vào', 'trên', 'dưới', 'sau', 'trước',
    'năm', 'tháng', 'ngày', 'giờ', 'phút', 'giây', 'nơi', 'nơi', 'nào',
    'đâu', 'sao', 'thế', 'nào', 'gì', 'ai', 'đây', 'đấy', 'kia'
}

# English stopwords (common words)
ENGLISH_STOPWORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
}

# Combine stopwords
STOPWORDS = VIETNAMESE_STOPWORDS | ENGLISH_STOPWORDS


class AmountExtractor:
    """Extracts monetary amounts from text descriptions"""
    
    # Currency patterns
    VIETNAMESE_CURRENCY = ['đồng', 'dong', 'vnd', 'vnđ', 'vn dong', 'vietnam dong']
    ENGLISH_CURRENCY = ['dollar', 'dollars', 'usd', '$', 'us dollar']
    
    @staticmethod
    def extract_amount(text: str) -> float:
        """
        Extract amount from text description
        
        Handles formats like:
        - "Mua đồ ăn 150000 đồng"
        - "Buy groceries $150"
        - "Thanh toán 500.000 VNĐ"
        - "Pay 150k"
        - "Mua sách 1,500,000"
        
        Args:
            text: Expense description text
            
        Returns:
            Extracted amount as float, or None if not found
        """
        if not isinstance(text, str):
            text = str(text)
        
        # Patterns to match amounts with flags for k suffix
        patterns = [
            # Pattern 1: Number followed by currency (e.g., "150000 đồng", "$150")
            (r'(\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)\s*(?:đồng|dong|vnd|vnđ|vn\s*dong|vietnam\s*dong|dollar|dollars|usd|\$|us\s*dollar)', False),
            # Pattern 2: Currency followed by number (e.g., "$150", "VNĐ 500000")
            (r'(?:đồng|dong|vnd|vnđ|vn\s*dong|vietnam\s*dong|dollar|dollars|usd|\$|us\s*dollar)\s*(\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)', False),
            # Pattern 3: Number with k/K suffix (e.g., "150k", "500K", "1050k")
            (r'(\d+(?:\.\d+)?)\s*[kK]', True),  # True means multiply by 1000
            # Pattern 4: Standalone large numbers (likely amounts)
            (r'\b(\d{4,}(?:[.,]\d{3})*)\b', False),
            # Pattern 5: Number with commas/dots as thousands separator
            (r'(\d{1,3}(?:[.,]\d{3})+)\b', False),
        ]
        
        # Try each pattern
        for pattern, is_k_suffix in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Take the first (largest) match
                amount_str = matches[0] if isinstance(matches[0], str) else matches[-1]
                
                # Clean the amount string (remove commas, dots used as separators)
                # Handle Vietnamese format: 150.000 or 150,000
                # But preserve decimal point if it's a decimal number
                if '.' in amount_str and not is_k_suffix:
                    # Check if it's a decimal or thousands separator
                    parts = amount_str.split('.')
                    if len(parts) == 2 and len(parts[1]) <= 2:
                        # Likely a decimal (e.g., "150.50")
                        amount_str = amount_str.replace(',', '')
                    else:
                        # Likely thousands separator
                        amount_str = amount_str.replace(',', '').replace('.', '')
                else:
                    amount_str = amount_str.replace(',', '').replace('.', '')
                
                try:
                    amount = float(amount_str)
                    # If it's a 'k' suffix pattern, always multiply by 1000
                    if is_k_suffix:
                        amount = amount * 1000
                    return amount
                except ValueError:
                    continue
        
        # If no pattern matched, try to find any large number
        # This is a fallback for cases like "Mua đồ ăn 150000"
        numbers = re.findall(r'\b(\d{4,})\b', text)
        if numbers:
            try:
                # Take the largest number found
                amounts = [float(n.replace(',', '').replace('.', '')) for n in numbers]
                return max(amounts)
            except ValueError:
                pass
        
        return None
    
    @staticmethod
    def extract_amount_with_currency(text: str) -> dict:
        """
        Extract amount and currency from text
        
        Returns:
            Dictionary with 'amount' and 'currency' keys
        """
        amount = AmountExtractor.extract_amount(text)
        
        if amount is None:
            return {"amount": None, "currency": None}
        
        # Detect currency
        text_lower = text.lower()
        currency = None
        
        if any(c in text_lower for c in ['đồng', 'dong', 'vnd', 'vnđ']):
            currency = "VND"
        elif any(c in text_lower for c in ['dollar', 'usd', '$']):
            currency = "USD"
        
        return {
            "amount": amount,
            "currency": currency
        }


class TextPreprocessor:
    """Handles text preprocessing operations"""
    
    @staticmethod
    def lowercase(text: str) -> str:
        """Convert text to lowercase"""
        return text.lower()
    
    @staticmethod
    def remove_punctuation(text: str) -> str:
        """Remove punctuation and special characters"""
        # Keep Vietnamese characters, remove punctuation
        text = re.sub(r'[^\w\s]', ' ', text)
        return text
    
    @staticmethod
    def remove_digits(text: str) -> str:
        """Remove digits"""
        return re.sub(r'\d+', ' ', text)
    
    @staticmethod
    def remove_stopwords(text: str) -> str:
        """Remove stopwords"""
        words = text.split()
        filtered_words = [w for w in words if w.lower() not in STOPWORDS]
        return ' '.join(filtered_words)
    
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Tokenize text into words"""
        # Simple word tokenization (split by whitespace)
        tokens = text.split()
        # Remove empty tokens
        tokens = [t for t in tokens if t.strip()]
        return tokens
    
    @staticmethod
    def preprocess_text(text: str) -> str:
        """
        Complete preprocessing pipeline
        
        Args:
            text: Raw text input
            
        Returns:
            Preprocessed text
        """
        if not isinstance(text, str):
            text = str(text)
        
        # Apply preprocessing steps
        text = TextPreprocessor.lowercase(text)
        text = TextPreprocessor.remove_punctuation(text)
        text = TextPreprocessor.remove_digits(text)
        text = TextPreprocessor.remove_stopwords(text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    @staticmethod
    def preprocess_batch(texts: List[str]) -> List[str]:
        """Preprocess a batch of texts"""
        return [TextPreprocessor.preprocess_text(text) for text in texts]


class TFIDFVectorizer:
    """TF-IDF Vectorization wrapper"""
    
    def __init__(self, max_features: int = 5000, min_df: int = 2, 
                 max_df: float = 0.95, ngram_range: Tuple[int, int] = (1, 2)):
        """
        Initialize TF-IDF Vectorizer
        
        Args:
            max_features: Maximum number of features
            min_df: Minimum document frequency
            max_df: Maximum document frequency
            ngram_range: Range of n-grams to use
        """
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            min_df=min_df,
            max_df=max_df,
            ngram_range=ngram_range,
            lowercase=False,  # We already lowercase in preprocessing
            token_pattern=r'\b\w+\b'
        )
        self.preprocessor = TextPreprocessor()
        self.is_fitted = False
    
    def fit(self, texts: List[str]):
        """
        Fit the vectorizer on training texts
        
        Args:
            texts: List of raw text descriptions
        """
        # Preprocess texts
        preprocessed_texts = self.preprocessor.preprocess_batch(texts)
        
        # Fit vectorizer
        self.vectorizer.fit(preprocessed_texts)
        self.is_fitted = True
        
        print(f"TF-IDF vectorizer fitted on {len(texts)} texts")
        print(f"Vocabulary size: {len(self.vectorizer.vocabulary_)}")
    
    def transform(self, texts: List[str]) -> np.ndarray:
        """
        Transform texts to TF-IDF vectors
        
        Args:
            texts: List of raw text descriptions
            
        Returns:
            TF-IDF matrix
        """
        if not self.is_fitted:
            raise ValueError("Vectorizer must be fitted before transforming")
        
        # Preprocess texts
        preprocessed_texts = self.preprocessor.preprocess_batch(texts)
        
        # Transform
        vectors = self.vectorizer.transform(preprocessed_texts)
        
        return vectors
    
    def fit_transform(self, texts: List[str]) -> np.ndarray:
        """
        Fit and transform texts
        
        Args:
            texts: List of raw text descriptions
            
        Returns:
            TF-IDF matrix
        """
        self.fit(texts)
        return self.transform(texts)
    
    def save(self, filepath: str = "models/tfidf_vectorizer.pkl"):
        """
        Save the vectorizer to disk
        
        Args:
            filepath: Path to save the vectorizer
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self.vectorizer, filepath)
        print(f"Saved TF-IDF vectorizer to {filepath}")
    
    def load(self, filepath: str = "models/tfidf_vectorizer.pkl"):
        """
        Load the vectorizer from disk
        
        Args:
            filepath: Path to load the vectorizer from
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Vectorizer file not found: {filepath}")
        
        self.vectorizer = joblib.load(filepath)
        self.is_fitted = True
        print(f"Loaded TF-IDF vectorizer from {filepath}")


if __name__ == "__main__":
    # Example usage
    sample_texts = [
        "Mua đồ ăn tại siêu thị",
        "Buy groceries at supermarket",
        "Thanh toán hóa đơn điện",
        "Pay electricity bill",
        "Mua vé xem phim",
        "Buy movie tickets"
    ]
    
    # Initialize vectorizer
    tfidf = TFIDFVectorizer(max_features=1000, min_df=1)
    
    # Fit and transform
    vectors = tfidf.fit_transform(sample_texts)
    
    print(f"\nTF-IDF vectors shape: {vectors.shape}")
    print(f"Sample vector (first text): {vectors[0].toarray()[0][:10]}...")
    
    # Save vectorizer
    tfidf.save()

