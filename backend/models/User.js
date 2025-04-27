const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true, 
    select: false,
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(v) {
        // At least one uppercase letter, one lowercase letter, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin'], 
    default: 'user' 
  },
  isVerified: { type: Boolean, default: false },
  emailToken: String,
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  refreshToken: String,
  permissions: [{
    type: String,
    enum: [
      'create_post',
      'edit_post',
      'delete_post',
      'manage_users',
      'manage_roles',
      'view_analytics'
    ]
  }]
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if user is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return await this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  if (this.role === 'admin') return true;
  return this.permissions.includes(permission);
};

// Static method to get role permissions
userSchema.statics.getRolePermissions = function(role) {
  const permissions = {
    user: ['create_post'],
    admin: ['create_post', 'edit_post', 'delete_post', 'manage_users'],
    super_admin: ['create_post', 'edit_post', 'delete_post', 'manage_users', 'manage_roles', 'view_analytics']
  };
  return permissions[role] || [];
};

module.exports = mongoose.model('User', userSchema); 