const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ถ้าทำงานใน Docker ให้ใช้ค่าจาก ENV ถ้าเทสในเครื่องใช้ localhost
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library_system');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;