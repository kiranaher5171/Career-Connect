import clientPromise from '../mongodb';
import bcrypt from 'bcryptjs';

export async function createUser(userData) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user object
    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role, // 'user' or 'admin'
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user
    const result = await users.insertOne(newUser);
    return { success: true, userId: result.insertedId };
  } catch (error) {
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const users = db.collection('users');
    return await users.findOne({ email });
  } catch (error) {
    throw error;
  }
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

