import mongoose from 'mongoose';
import { User } from '../src/app/modules/user/user.model';
import config from '../src/config';

async function main() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect("mongodb://localhost:27017/bug-buster");
    console.log('Successfully connected to MongoDB!');
    
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users.`);
    
    if (userCount === 0) {
      console.log('Creating test user...');
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'manager',
      });
      console.log('Created user:', user._id);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
