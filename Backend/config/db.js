const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/internship');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
};

module.exports = connectDB;
