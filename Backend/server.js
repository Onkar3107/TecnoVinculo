// importing packages
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
//importing db config
const connectDB = require('./config/db');
//importing routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Configure CORS for HTTP requests
//CORS - cross origin resource sharing
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware and routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents', require('./routes/documents'));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
