const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// Load env variables
dotenv.config();
// DB connection
const connectDB = require('./src/config/db');
// Error middleware
const { errorHandler } = require('./src/middleware/errorMiddleware');
// Routes
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
// Initialize app
const app = express();
// Connect DB
connectDB();
// ======================
// 🔥 CORS FIX (IMPORTANT)
// ======================
app.use(cors({
  origin: process.env.CLIENT_URL || "https://tegron-learnify-a1d1.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ======================
// Static files
// ======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ======================
// Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
// ======================
// Health check
// ======================
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Tegron Notes API is running 📚' });
});
// ======================
// Error handler
// ======================
app.use(errorHandler);
// ======================
// Server start
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
