"""
Anomaly Detection & Budget Check Module
Detects unusual expenses and checks against budget limits
"""

import pymongo
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import statistics
import os

# Try to import config, fallback to defaults
try:
    from config import MONGODB_URI, MONGODB_DB_NAME, ANOMALY_THRESHOLD, LOOKBACK_DAYS
except ImportError:
    # If config not available, use defaults
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "expense_db")
    ANOMALY_THRESHOLD = float(os.getenv("ANOMALY_THRESHOLD", "2.5"))
    LOOKBACK_DAYS = int(os.getenv("LOOKBACK_DAYS", "30"))


class AnomalyDetector:
    """Detects anomalies in expense patterns"""
    
    def __init__(self, mongo_uri: str = None,
                 db_name: str = None):
        """
        Initialize the anomaly detector
        
        Args:
            mongo_uri: MongoDB connection string (defaults to config/env)
            db_name: Database name (defaults to config/env)
        """
        self.mongo_uri = mongo_uri or MONGODB_URI
        self.db_name = db_name or MONGODB_DB_NAME
        self.client = None
        self.db = None
        self.anomaly_threshold = ANOMALY_THRESHOLD
        self.lookback_days = LOOKBACK_DAYS
    
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
    
    def get_historical_spending(self, userId: str, jarKey: str, 
                               days: int = None) -> List[float]:
        """
        Get historical spending amounts for a user's jar
        
        Args:
            userId: User ID
            jarKey: Jar key (NEC, FFA, LTSS, EDU, PLAY, GIVE)
            days: Number of days to look back (default: self.lookback_days)
            
        Returns:
            List of expense amounts
        """
        if not self.db:
            self.connect()
        
        if days is None:
            days = self.lookback_days
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Query expenses
        collection = self.db["expenses"]
        expenses = list(collection.find({
            "userId": userId,
            "jarKey": jarKey,
            "createdAt": {
                "$gte": start_date,
                "$lte": end_date
            },
            "amount": {"$exists": True, "$type": "number"}
        }))
        
        # Extract amounts
        amounts = [exp.get("amount", 0) for exp in expenses]
        
        return amounts
    
    def get_jar_monthly_total(self, userId: str, jarKey: str) -> float:
        """
        Get total spending in a jar for the current month
        
        Args:
            userId: User ID
            jarKey: Jar key
            
        Returns:
            Total amount spent this month
        """
        if not self.db:
            self.connect()
        
        # Get current month start
        now = datetime.now()
        month_start = datetime(now.year, now.month, 1)
        
        # Query expenses
        collection = self.db["expenses"]
        pipeline = [
            {
                "$match": {
                    "userId": userId,
                    "jarKey": jarKey,
                    "createdAt": {"$gte": month_start},
                    "amount": {"$exists": True, "$type": "number"}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$amount"}
                }
            }
        ]
        
        result = list(collection.aggregate(pipeline))
        
        if result:
            return float(result[0]["total"])
        return 0.0
    
    def get_jar_limit(self, userId: str, jarKey: str) -> Optional[float]:
        """
        Get monthly limit for a jar from JarConfig
        
        Args:
            userId: User ID
            jarKey: Jar key
            
        Returns:
            Monthly limit or None if not configured
        """
        if not self.db:
            self.connect()
        
        collection = self.db["jarConfigs"]
        config = collection.find_one({
            "userId": userId,
            "jarKey": jarKey
        })
        
        if config and "monthlyLimit" in config:
            return float(config["monthlyLimit"])
        
        return None
    
    def detect_anomaly(self, userId: str, jarKey: str, amount: float) -> Dict:
        """
        Detect if an expense is anomalous
        
        Args:
            userId: User ID
            jarKey: Jar key
            amount: Expense amount
            
        Returns:
            Dictionary with anomaly detection results
        """
        result = {
            "isAnomaly": False,
            "reasons": [],
            "level": "normal",
            "message": ""
        }
        
        # Get historical spending
        historical_amounts = self.get_historical_spending(userId, jarKey)
        
        if not historical_amounts:
            # No historical data, can't detect anomaly
            return result
        
        # Calculate statistics
        mean_spending = statistics.mean(historical_amounts)
        median_spending = statistics.median(historical_amounts)
        
        # Check if amount is significantly higher than mean
        if mean_spending > 0 and amount > (mean_spending * self.anomaly_threshold):
            result["isAnomaly"] = True
            result["reasons"].append("ANOMALY")
            result["level"] = "warning"
            result["message"] += f"Expense is {amount/mean_spending:.2f}x higher than average spending in {jarKey} jar. "
        
        # Check if amount is significantly higher than median
        if median_spending > 0 and amount > (median_spending * 3.0):
            if "ANOMALY" not in result["reasons"]:
                result["isAnomaly"] = True
                result["reasons"].append("ANOMALY")
            if result["level"] == "normal":
                result["level"] = "warning"
        
        # Check jar monthly limit
        monthly_total = self.get_jar_monthly_total(userId, jarKey)
        jar_limit = self.get_jar_limit(userId, jarKey)
        
        if jar_limit is not None:
            projected_total = monthly_total + amount
            
            if projected_total > jar_limit:
                result["isAnomaly"] = True
                result["reasons"].append("JAR_LIMIT")
                
                # Determine severity
                overage = projected_total - jar_limit
                overage_percentage = (overage / jar_limit) * 100
                
                if overage_percentage > 20:
                    result["level"] = "critical"
                elif overage_percentage > 10:
                    result["level"] = "warning"
                else:
                    result["level"] = "info"
                
                result["message"] += f"Expense exceeds monthly limit for {jarKey} jar. "
                result["message"] += f"Current: ${monthly_total:.2f}, Limit: ${jar_limit:.2f}, "
                result["message"] += f"After expense: ${projected_total:.2f} (${overage:.2f} over)."
        
        # Check budget limit (if exists)
        # This could be a total monthly budget across all jars
        total_monthly = self.get_total_monthly_spending(userId)
        total_budget = self.get_total_budget(userId)
        
        if total_budget is not None:
            projected_total_budget = total_monthly + amount
            
            if projected_total_budget > total_budget:
                result["isAnomaly"] = True
                if "BUDGET_LIMIT" not in result["reasons"]:
                    result["reasons"].append("BUDGET_LIMIT")
                
                if result["level"] == "normal":
                    result["level"] = "warning"
                
                result["message"] += f"Expense would exceed total monthly budget. "
                result["message"] += f"Current: ${total_monthly:.2f}, Budget: ${total_budget:.2f}. "
        
        # Set default message if no issues
        if not result["isAnomaly"]:
            result["message"] = "Expense is within normal limits."
        
        return result
    
    def get_total_monthly_spending(self, userId: str) -> float:
        """Get total spending across all jars this month"""
        if not self.db:
            self.connect()
        
        now = datetime.now()
        month_start = datetime(now.year, now.month, 1)
        
        collection = self.db["expenses"]
        pipeline = [
            {
                "$match": {
                    "userId": userId,
                    "createdAt": {"$gte": month_start},
                    "amount": {"$exists": True, "$type": "number"}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$amount"}
                }
            }
        ]
        
        result = list(collection.aggregate(pipeline))
        
        if result:
            return float(result[0]["total"])
        return 0.0
    
    def get_total_budget(self, userId: str) -> Optional[float]:
        """Get total monthly budget for user"""
        if not self.db:
            self.connect()
        
        collection = self.db["jarConfigs"]
        configs = list(collection.find({"userId": userId}))
        
        if not configs:
            return None
        
        total_budget = sum(
            config.get("monthlyLimit", 0) 
            for config in configs 
            if "monthlyLimit" in config
        )
        
        return float(total_budget) if total_budget > 0 else None


if __name__ == "__main__":
    # Example usage
    detector = AnomalyDetector()
    detector.connect()
    
    # Example: Detect anomaly for a new expense
    result = detector.detect_anomaly(
        userId="user123",
        jarKey="NEC",
        amount=500.0
    )
    
    print("Anomaly Detection Result:")
    print(result)
    
    detector.disconnect()

