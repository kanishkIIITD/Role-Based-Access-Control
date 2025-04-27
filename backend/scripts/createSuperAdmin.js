const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://pushpinder280:GRZGfSRa5GlbaFDl@cluster0.wu1qt.mongodb.net/blog-platform';

const createSuperAdmin = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB with more detailed options
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Successfully connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    console.log('Creating super admin user...');

    // Create super admin
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@blogify.com',
      password: 'Admin@123', // This will be hashed by the pre-save hook
      role: 'super_admin',
      isVerified: true,
      permissions: User.getRolePermissions('super_admin')
    });

    await superAdmin.save();
    console.log('Super admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
};

createSuperAdmin(); 