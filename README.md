# Smart Personal Expense Management System

A comprehensive full-stack expense management system with AI-powered classification, anomaly detection, and the 6 Jars financial model.

## 🎯 Features

- **🤖 AI-Powered Classification**: Automatically classifies expenses using TF-IDF + Naive Bayes
- **💰 Amount Extraction**: Extracts amounts from text descriptions (Vietnamese & English)
- **🏦 6 Jars Financial Model**: NEC, FFA, LTSS, EDU, PLAY, GIVE
- **🚨 Anomaly Detection**: Detects unusual expenses and budget violations
- **🔔 Alert System**: Real-time alerts for anomalies and budget limits
- **📊 Beautiful Dashboard**: Interactive charts and visualizations
- **🔐 User Authentication**: Secure JWT-based authentication
- **📱 Responsive UI**: Modern React frontend with Tailwind CSS

## 📁 Project Structure

```
caohocday/
├── ai-service/              # Python AI service (FastAPI)
│   ├── modules/             # AI modules
│   │   ├── data_labeling.py
│   │   ├── text_preprocessing.py
│   │   ├── classification.py
│   │   └── anomaly_detection.py
│   ├── api/                 # FastAPI service
│   │   └── main.py
│   ├── models/              # Trained ML models (generated)
│   ├── demo_test.py         # Demo test script
│   ├── train_model.py       # Training script
│   └── requirements.txt
├── backend/                 # Node.js/Express backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Auth middleware
│   ├── config/              # Configuration
│   ├── server.js            # Express server
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── package.json
└── README.md                # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - For AI service
- **Node.js 16+** - For backend and frontend
- **MongoDB 4.4+** - Database
- **npm** or **yarn** - Package manager
- **pip** - Python package manager

### Step 1: Clone and Setup

```bash
# Navigate to project directory
cd caohocday
```

### Step 2: Setup AI Service (Python)

```bash
# Navigate to AI service directory
cd ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Train demo model (creates models in models/ directory)
python demo_test.py

# Start FastAPI service
python run_api.py
```

The AI service will be available at: **http://localhost:8000**

**Verify AI service is running:**
- Visit: http://localhost:8000/docs (Swagger UI)
- Or: http://localhost:8000/health

### Step 3: Setup Backend (Node.js)

Open a **new terminal** window:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the example below or create manually
```

Create `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/expense_db
PORT=3000
NODE_ENV=development
AI_API_URL=http://localhost:8000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# Start MongoDB (if not running as a service)
# On Windows: Make sure MongoDB service is running
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

The backend API will be available at: **http://localhost:3000**

**Verify backend is running:**
- Visit: http://localhost:3000/health
- Should return: `{"status":"healthy","timestamp":"..."}`

### Step 4: Setup Frontend (React)

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Step 5: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Register a new account or login
3. Start adding expenses!

## 🧪 Testing the System

### Test AI Service

```bash
cd ai-service
python demo_test.py
```

Enter test descriptions like:
- `Mua đồ ăn 150000 đồng`
- `Buy groceries $200`
- `Thanh toán hóa đơn 500.000 VNĐ`

### Test Backend API

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'

# Save the token from response, then:
# Create an expense (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Mua đồ ăn 150000 đồng"
  }'
```

### Test Frontend

1. Go to http://localhost:5173
2. Register/Login
3. Navigate through:
   - Dashboard
   - Expenses (add/view/edit)
   - 6 Jars (view/edit limits)
   - Alerts (view notifications)

## 📋 Complete Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] MongoDB installed and running
- [ ] AI service dependencies installed (`pip install -r ai-service/requirements.txt`)
- [ ] AI models trained (`python ai-service/demo_test.py`)
- [ ] AI service running (`python ai-service/run_api.py`)
- [ ] Backend dependencies installed (`npm install` in `backend/`)
- [ ] Backend `.env` file created with correct values
- [ ] Backend server running (`npm run dev` in `backend/`)
- [ ] Frontend dependencies installed (`npm install` in `frontend/`)
- [ ] Frontend server running (`npm run dev` in `frontend/`)
- [ ] All three services accessible:
  - AI Service: http://localhost:8000
  - Backend API: http://localhost:3000
  - Frontend: http://localhost:5173

## 🔧 Configuration

### AI Service Configuration

**File:** `ai-service/api/main.py`

- Default port: `8000`
- Models location: `ai-service/models/`
- Change port in `run_api.py` if needed

### Backend Configuration

**File:** `backend/.env`

```env
MONGODB_URI=mongodb://localhost:27017/expense_db
PORT=3000
NODE_ENV=development
AI_API_URL=http://localhost:8000
JWT_SECRET=your-secret-key-here
```

### Frontend Configuration

**File:** `frontend/vite.config.js`

- API proxy configured to forward `/api` to `http://localhost:3000`
- Default port: `5173`
- Change if needed

## 🐛 Troubleshooting

### AI Service Issues

**Problem:** `ModuleNotFoundError: No module named 'joblib'`
```bash
# Solution: Install dependencies
cd ai-service
pip install -r requirements.txt
```

**Problem:** `FileNotFoundError: models/tfidf_vectorizer.pkl`
```bash
# Solution: Train the model first
cd ai-service
python demo_test.py
```

**Problem:** AI service not responding
- Check if port 8000 is available
- Verify models exist in `ai-service/models/`
- Check console for errors

### Backend Issues

**Problem:** `MongoNetworkError: connect ECONNREFUSED`
```bash
# Solution: Start MongoDB
# Windows: Check MongoDB service is running
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Problem:** `Error: AI service is not available`
- Make sure AI service is running on port 8000
- Check `AI_API_URL` in `.env` file
- Test: `curl http://localhost:8000/health`

**Problem:** `JWT_SECRET` error
- Make sure `.env` file exists in `backend/` directory
- Add `JWT_SECRET` to `.env` file
- Restart backend server

### Frontend Issues

**Problem:** `Cannot GET /api/...`
- Make sure backend is running on port 3000
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

**Problem:** `401 Unauthorized`
- Make sure you're logged in
- Check if token is stored in localStorage
- Try logging out and logging back in

**Problem:** Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Documentation

### Backend API

Once backend is running, visit:
- **Swagger UI**: Not available (use Postman/curl)
- **Health Check**: http://localhost:3000/health

### AI Service API

Once AI service is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🎓 Usage Examples

### Adding an Expense

**Via Frontend:**
1. Go to Expenses page
2. Click "Add Expense"
3. Enter description: `Mua đồ ăn 150000 đồng`
4. AI will automatically:
   - Extract amount: 150000
   - Classify category: Food
   - Assign jar: NEC
   - Detect anomalies

**Via API:**
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"description": "Mua đồ ăn 150000 đồng"}'
```

### Viewing Dashboard

1. Login to frontend
2. Dashboard shows:
   - Total spending this month
   - Expense distribution chart
   - Recent expenses
   - Unread alerts count

### Managing 6 Jars

1. Go to "6 Jars" page
2. View spending for each jar
3. Click edit icon to set monthly limits
4. Progress bars show spending vs limits

## 🔐 Security Notes

- **JWT_SECRET**: Change the default secret in production
- **MongoDB**: Use authentication in production
- **CORS**: Configure allowed origins in production
- **Environment Variables**: Never commit `.env` files

## 📦 Production Deployment

### AI Service
```bash
cd ai-service
# Use gunicorn or uvicorn for production
gunicorn api.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Backend
```bash
cd backend
# Set NODE_ENV=production
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve dist/ directory with nginx or similar
```

## 🤝 Contributing

This project was built for a team of 3 students. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

ISC

## 👥 Team

Built for a team of 3 students learning ML and full-stack development.

## 🆘 Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all services are running
3. Check console logs for errors
4. Ensure all dependencies are installed
5. Verify environment variables are set correctly

## 📞 Support

For issues or questions:
- Check individual component READMEs:
  - `ai-service/README.md`
  - `backend/README.md`
  - `frontend/README.md`

---

**Happy Expense Managing! 💰**
