import { NextResponse } from 'next/server';
import { createUser } from '@/lib/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "user" or "admin"' },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    return NextResponse.json(
      { message: 'User created successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

