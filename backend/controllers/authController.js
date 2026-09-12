const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitize = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
  location: u.location,
  skills: u.skills,
  resume: u.resume,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email and password');
    }
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('Email already registered');
    }
    const allowedRole = ['jobseeker', 'employer'].includes(role) ? role : 'jobseeker';
    const user = await User.create({ name, email, password, role: allowedRole });
    res.status(201).json({
      user: sanitize(user),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    res.json({
      user: sanitize(user),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    const fields = ['name', 'phone', 'location', 'skills', 'resume'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }
    const url = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.resume = url;
    await user.save();
    res.json({ resume: url, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, updateMe, uploadResume };