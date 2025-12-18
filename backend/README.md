# Expense Management Backend API

Node.js/Express backend for the Smart Personal Expense Management System with AI integration.

## Features

- **AI-Powered Classification**: Automatically classifies expenses using Python FastAPI service
- **6 Jars Financial Model**: Supports NEC, FFA, LTSS, EDU, PLAY, GIVE jars
- **Anomaly Detection**: Detects unusual expenses and budget violations
- **Alert System**: Creates alerts for anomalies and budget limits
- **RESTful API**: Clean API endpoints for expenses, alerts, and jars

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/expense_db
PORT=3000
AI_API_URL=http://localhost:8000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at: `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires auth)
- `PUT /api/auth/me` - Update user profile (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/verify-token` - Verify JWT token (requires auth)

### Expenses

- `POST /api/expenses` - Create a new expense (with AI classification)
- `GET /api/expenses` - Get expenses with filters
- `GET /api/expenses/:id` - Get a single expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/stats/summary` - Get expense statistics

### Alerts

- `GET /api/alerts` - Get alerts for a user
- `GET /api/alerts/unread` - Get unread alerts
- `PUT /api/alerts/:id/read` - Mark alert as read
- `PUT /api/alerts/read-all` - Mark all alerts as read
- `DELETE /api/alerts/:id` - Delete an alert

### Jars

- `GET /api/jars` - Get all jars for a user
- `POST /api/jars/initialize` - Initialize default jars
- `PUT /api/jars/:jarKey` - Update jar configuration
- `GET /api/jars/:jarKey/stats` - Get jar statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

Note: `identifier` can be either email or username.

## Example Usage

### Create an Expense (with AI classification)

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "description": "Mua đồ ăn 150000 đồng"
  }'
```

Note: `userId` is automatically extracted from the JWT token, so you don't need to provide it.

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "<user-id-from-token>",
    "description": "Mua đồ ăn 150000 đồng",
    "amount": 150000,
    "category": "Food",
    "jarKey": "NEC",
    "ai": {
      "predictedCategory": "Food",
      "predictedJarKey": "NEC",
      "confidence": 0.8523,
      "extractedAmount": 150000,
      "classifiedAt": "2024-01-01T00:00:00.000Z"
    },
    "anomaly": {
      "isAnomaly": false,
      "reasons": [],
      "level": "normal",
      "message": "Expense is within normal limits."
    }
  }
}
```

### Get Unread Alerts

```bash
curl http://localhost:3000/api/alerts/unread \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Initialize Default Jars

```bash
curl -X POST http://localhost:3000/api/jars/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>"
```

Note: `userId` is automatically extracted from the JWT token.

## Integration with AI Service

The backend automatically calls the Python FastAPI service for expense classification. Make sure the AI service is running:

```bash
# In the ai-service directory
python run_api.py
```

The AI service should be available at `http://localhost:8000` (or the URL specified in `AI_API_URL`).

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Expense.js           # Expense model
│   ├── JarConfig.js         # Jar configuration model
│   └── Alert.js             # Alert model
├── routes/
│   ├── expenses.js          # Expense routes
│   ├── alerts.js            # Alert routes
│   └── jars.js              # Jar routes
├── services/
│   ├── aiService.js         # AI service integration
│   └── anomalyService.js    # Anomaly detection service
├── server.js                # Main server file
├── package.json             # Dependencies
└── README.md                # This file
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `AI_API_URL` - Python FastAPI service URL (default: http://localhost:8000)
- `JWT_SECRET` - Secret key for JWT token signing (required, change in production!)

See `ENV_EXAMPLE.md` for a complete example.

