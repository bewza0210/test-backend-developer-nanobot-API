const userService = require('../services/userService');

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id) || 0;
    const filters = req.query || {};
    const data = await userService.getUser(id, filters);
    res.status(200).json({ isError: false, body: data });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true, message: err.message || 'Failed to fetch users' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Internal server error.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = parseInt(req.params.id) || 0;
    const { oldPassword, newPassword } = req.body || {};
    const user = await userService.changePassword(id, oldPassword, newPassword);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ isError: false, message: 'User updated successfully',  });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Internal server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ isError: false, message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.statusCode) return res.status(err.statusCode).json({ isError: true ,message: err.message });
    res.status(500).json({ isError: true ,message: 'Failed to delete user' });
  }
};
