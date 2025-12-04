import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '@/lib/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token with expiration based on rememberMe
    const token = generateToken(user, rememberMe);

    // Return user data (without password) and token
    const userData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with expiration based on rememberMe
    // If rememberMe is true, set cookie for 30 days, otherwise 7 days
    const maxAge = rememberMe 
      ? 60 * 60 * 24 * 30 // 30 days
      : 60 * 60 * 24 * 7; // 7 days
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

