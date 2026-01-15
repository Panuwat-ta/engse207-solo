// server.js
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./src/presentation/routes/studentRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/students', studentRoutes);

// Error handling (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Student Management System running on http://192.168.56.110:${PORT}`);
});