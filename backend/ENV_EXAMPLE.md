# Environment Variables Example

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/expense_db

# Server Configuration
PORT=3000
NODE_ENV=development

# AI Service Configuration
AI_API_URL=http://localhost:8000

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Important Notes

- **JWT_SECRET**: Use a strong, random string in production. You can generate one using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **MONGODB_URI**: Update with your MongoDB connection string
- **AI_API_URL**: Update if your AI service runs on a different port/URL

