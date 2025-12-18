"""
Run the FastAPI service
Simple script to start the API server
"""

import uvicorn
import os
import sys

# Get the project root directory (ai-service folder)
project_root = os.path.dirname(os.path.abspath(__file__))

# Add project root to Python path
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if __name__ == "__main__":
    print("="*60)
    print("Starting Expense Classification API")
    print("="*60)
    print("API will be available at: http://localhost:8000")
    print("API docs will be available at: http://localhost:8000/docs")
    print("="*60)
    print()
    
    # Change to project root to ensure relative imports work
    original_cwd = os.getcwd()
    os.chdir(project_root)
    
    try:
        # Import the app directly
        from api.main import app
        
        # Run the API
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info",
            reload_dirs=[project_root]  # Watch the entire project for changes
        )
    except ImportError as e:
        print(f"Error importing app: {e}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Python path: {sys.path}")
        print("\nTrying alternative method...")
        
        # Fallback: use string-based import
        uvicorn.run(
            "api.main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,  # Disable reload for fallback
            log_level="info"
        )
    finally:
        os.chdir(original_cwd)

