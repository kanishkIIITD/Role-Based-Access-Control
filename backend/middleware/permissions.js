const User = require('../models/User');

// Check if user has specific permission
exports.checkPermission = (permission) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.hasPermission(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if user has any of the specified permissions
exports.checkAnyPermission = (permissions) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const hasPermission = permissions.some(permission => user.hasPermission(permission));
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if user has all of the specified permissions
exports.checkAllPermissions = (permissions) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const hasAllPermissions = permissions.every(permission => user.hasPermission(permission));
    if (!hasAllPermissions) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 