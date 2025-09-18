const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Failed to create user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login(username, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 15*60*1000  // 15 นาที
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7*24*60*60*1000 // 7 วัน
    });
    res.json({ isError: false, message: 'Login success' });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Failed to update user' });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await authService.profile(req.user.id);
    res.json({ isError: false,  message: 'OK', body: user });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Failed to update user' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ isError: false,  message: 'Logout success', user });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Failed to update user' });
  }
};
