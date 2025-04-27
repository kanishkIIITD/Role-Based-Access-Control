const fs = require('fs');
const path = require('path');

// Get the absolute path to the .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Attempting to create .env file at:', envPath);

// Check if the backend directory exists
const backendDir = path.dirname(envPath);
if (!fs.existsSync(backendDir)) {
  console.error('Backend directory does not exist:', backendDir);
  process.exit(1);
}

const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
FRONTEND_URL=http://localhost:3000`;

try {
  // Check if .env file already exists
  if (fs.existsSync(envPath)) {
    console.log('.env file already exists at:', envPath);
    console.log('Current content:');
    console.log(fs.readFileSync(envPath, 'utf8'));
    console.log('\nPlease verify the values are correct.');
  } else {
    // Create .env file
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('.env file created successfully at:', envPath);
    console.log('\nPlease update the following values in the .env file:');
    console.log('1. MONGODB_URI - Your MongoDB connection string');
    console.log('2. JWT_SECRET - A secure random string for JWT signing');
    console.log('3. JWT_REFRESH_SECRET - A secure random string for refresh tokens');
    console.log('4. EMAIL_USER - Your email address for sending verification emails');
    console.log('5. EMAIL_PASS - Your email app password');
  }

  // Verify the file was created and is readable
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('\nVerification:');
    console.log('File exists:', true);
    console.log('File is readable:', true);
    console.log('File size:', content.length, 'bytes');
  } else {
    console.error('Failed to create .env file');
  }
} catch (error) {
  console.error('Error creating .env file:', error);
  console.error('Error details:', {
    code: error.code,
    path: error.path,
    message: error.message
  });
} 