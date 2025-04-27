const path = require('path');
const dotenv = require('dotenv');

// Get the absolute path to the .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Looking for .env file at:', envPath);

// Load the .env file
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('\nTesting environment variables:');
console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL); 