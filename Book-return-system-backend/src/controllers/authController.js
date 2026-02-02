const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // เรียก Model

exports.register = async (req, res) => {
  const { username, password, full_name, role, profile_image } = req.body;
  try {
    // เช็ค User ซ้ำ
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username exists' });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้าง User ใหม่ (คำสั่ง Create ง่ายกว่า SQL เยอะ)
    await User.create({ username, password: hashedPassword, full_name, role: role || 'user', profile_image });

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // MongoDB ใช้ _id แทน id
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, profile_image: user.profile_image, full_name: user.full_name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { full_name, profile_image } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (full_name) user.full_name = full_name;
    if (profile_image) user.profile_image = profile_image;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        profile_image: user.profile_image,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // ไม่ส่ง password กลับไป
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};