/**
 * Database Configuration
 * MongoDB connection setup
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // TLS options for Atlas on Windows (dev only!)
      tls: true,
      tlsAllowInvalidCertificates: true, // remove in production if you install proper CA
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

