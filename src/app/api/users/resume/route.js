import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// POST - Save user's resume
export async function POST(request) {
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

    const body = await request.json();
    const { resumeData } = body;

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const resumes = db.collection('resumes');
    
    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;

    // Upsert resume data
    await resumes.updateOne(
      { userId: userId },
      {
        $set: {
          userId: userId,
          resumeData: resumeData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Resume saved successfully',
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}

// GET - Get current user's resume
export async function GET(request) {
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

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const resumes = db.collection('resumes');
    
    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;

    const resume = await resumes.findOne({ userId: userId });

    if (!resume) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: resume.resumeData || null,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

