const jwt = require('jsonwebtoken');

// ตรวจสอบว่ามี Token ไหม และถูกต้องไหม
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Format ของ Token คือ "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    // แกะรหัส Token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
    req.user = verified; // แปะข้อมูล user ลงใน request เพื่อให้ controller เอาไปใช้ต่อได้
    next(); // อนุญาตให้ไปต่อ
  } catch (error) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

// (แถม) ตรวจสอบว่าเป็น Admin เท่านั้น
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admins Only' });
  }
};