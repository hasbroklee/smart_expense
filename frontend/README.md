# Expense Management Frontend

Beautiful React frontend for the Smart Personal Expense Management System.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 User authentication (Login/Register)
- 📊 Dashboard with expense overview and charts
- 💰 Expense management (Add, Edit, Delete)
- 🏦 6 Jars visualization with progress bars
- 🔔 Real-time alerts and notifications
- 📈 Interactive charts using Recharts

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout.jsx   # Main layout with sidebar
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Jars.jsx
│   │   └── Alerts.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000`. Make sure the backend is running.

The API proxy is configured in `vite.config.js` to forward `/api` requests to the backend.

## Features Overview

### Authentication
- Login with email/username
- User registration
- JWT token management
- Protected routes

### Dashboard
- Total spending this month
- Expense count
- Unread alerts count
- Expense distribution chart
- Recent expenses list

### Expenses
- Add expenses (AI auto-classification)
- View all expenses
- Edit expenses
- Delete expenses
- Filter and search

### 6 Jars
- Visual representation of all jars
- Spending progress bars
- Monthly limits
- Remaining budget
- Edit jar limits

### Alerts
- View all alerts
- Mark as read
- Delete alerts
- Filter by type/level
- Unread count badge

## Technologies Used

- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Date-fns** - Date formatting
- **Vite** - Build tool

## Environment Variables

No environment variables needed for development. The API proxy is configured in `vite.config.js`.

For production, you may want to set:
- `VITE_API_URL` - Backend API URL

