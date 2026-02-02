const express = require('express');
const cors = require('cors');
require('dotenv').config(); // อ่านค่าจาก .env

// 1. เพิ่มบรรทัดนี้: เรียกใช้ Config ของ MongoDB
const connectDB = require('./src/config/database');

const app = express();
const port = process.env.PORT || 3000;

// 2. เพิ่มบรรทัดนี้: สั่งเชื่อมต่อฐานข้อมูลทันที
connectDB();

// Middleware
app.use(cors()); // อนุญาตให้ Expo ต่อเข้ามาได้
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);

// Base Route (ไว้เช็คว่า Server ดับไหม)
app.get('/', (req, res) => {
  res.send('Library API (MongoDB) Ready! 🚀');
});

// 3. แก้ไขส่วน Start Server (สำคัญมาก!)
// ลบ app.listen ตัวบนทิ้งไปเลย เหลือไว้แค่อันใน if นี้
// เพื่อให้เวลา Unit Test (Jest) เรียกใช้ไฟล์นี้ Server จะได้ไม่ถูกเปิดซ้ำซ้อน
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// ส่งออก app เพื่อให้ Unit Test เอาไปใช้ต่อได้
module.exports = app;