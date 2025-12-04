import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET user's resume by userId (Admin only)
export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const users = db.collection('users');
    
    const adminUserId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;
    
    const adminUser = await users.findOne({ _id: adminUserId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get target user's resume
    const { userId } = params;
    const targetUserId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const resumes = db.collection('resumes');
    const resume = await resumes.findOne({ userId: targetUserId });

    if (!resume) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No resume found for this user'
      });
    }

    return NextResponse.json({
      success: true,
      data: resume.resumeData || null,
    });
  } catch (error) {
    console.error('Error fetching user resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

