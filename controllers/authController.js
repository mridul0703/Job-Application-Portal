const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('./tokenController');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // make false for local
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
  return res.status(401).json({ error: 'Invalid email or password' });
}


    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // local testing
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("💥 Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

exports.logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (err) {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  }
};