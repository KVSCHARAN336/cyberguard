const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cyber_hosting_checker';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Operating with in-memory fallback cache & history store.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
