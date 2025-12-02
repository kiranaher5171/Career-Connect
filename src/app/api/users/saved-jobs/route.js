import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET saved jobs for current user
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
    const savedJobs = db.collection('savedJobs');

    // Use userId as string (MongoDB will handle conversion if needed)
    // Try both string and ObjectId formats for compatibility
    const userId = decoded.userId;
    let userIdQuery;
    try {
      // Try to convert to ObjectId if it's a valid ObjectId string
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      // If conversion fails, use as string
      userIdQuery = userId;
    }

    // Query with both formats to ensure we get results
    const userSavedJobs = await savedJobs
      .find({
        $or: [
          { userId: userId },
          { userId: userIdQuery }
        ]
      })
      .toArray();

    // Populate job details
    const jobs = db.collection('jobs');
    const populatedJobs = await Promise.all(
      userSavedJobs.map(async (savedJob) => {
        let job = null;
        if (savedJob.jobId) {
          try {
            const jobId = typeof savedJob.jobId === 'string' 
              ? new ObjectId(savedJob.jobId) 
              : savedJob.jobId;
            job = await jobs.findOne({ _id: jobId });
          } catch (error) {
            console.error('Error finding job:', error);
          }
        }
        return {
          ...savedJob,
          job: job || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: populatedJobs,
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved jobs' },
      { status: 500 }
    );
  }
}

// POST save a job
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
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const savedJobs = db.collection('savedJobs');

    // Convert jobId to ObjectId if it's a string
    let jobObjectId;
    try {
      jobObjectId = typeof jobId === 'string' ? new ObjectId(jobId) : jobId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Use userId - try both string and ObjectId formats
    const userId = decoded.userId;
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    // Check if already saved (try both formats)
    const existing = await savedJobs.findOne({
      $or: [
        { userId: userId, jobId: jobObjectId },
        { userId: userIdQuery, jobId: jobObjectId }
      ]
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Job already saved' },
        { status: 400 }
      );
    }

    // Save job - store userId as string for consistency
    const result = await savedJobs.insertOne({
      userId: userId, // Store as string to match token format
      jobId: jobObjectId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save job' },
      { status: 500 }
    );
  }
}

// DELETE unsave a job
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const savedJobs = db.collection('savedJobs');

    // Convert jobId to ObjectId if it's a string
    let jobObjectId;
    try {
      jobObjectId = typeof jobId === 'string' ? new ObjectId(jobId) : jobId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Use userId - try both string and ObjectId formats
    const userId = decoded.userId;
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    // Try to delete with both formats
    let result = await savedJobs.deleteOne({
      userId: userId,
      jobId: jobObjectId,
    });

    // If not found with string format, try ObjectId format
    if (result.deletedCount === 0) {
      result = await savedJobs.deleteOne({
        userId: userIdQuery,
        jobId: jobObjectId,
      });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Saved job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job removed from saved jobs',
    });
  } catch (error) {
    console.error('Error removing saved job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove saved job' },
      { status: 500 }
    );
  }
}

