const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res, next) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    if (!['hr', 'candidate'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Simple auth: Find or create user based on name and role
    let user = await User.findOne({ name, role });
    
    if (!user) {
      user = new User({ name, role });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
