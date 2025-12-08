import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

// POST - Create a new referral
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

    // Handle FormData (for file upload) or JSON
    let jobId, jobRole, friendName, friendEmail, phoneNumber, message, resumeFile;
    
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      jobId = formData.get('jobId');
      jobRole = formData.get('jobRole');
      friendName = formData.get('friendName');
      friendEmail = formData.get('friendEmail');
      phoneNumber = formData.get('phoneNumber');
      message = formData.get('message');
      resumeFile = formData.get('resume');
    } else {
      const body = await request.json();
      jobId = body.jobId;
      jobRole = body.jobRole;
      friendName = body.friendName;
      friendEmail = body.friendEmail;
      phoneNumber = body.phoneNumber;
      message = body.message;
    }

    // Validate required fields
    if (!jobId || !friendName || !friendEmail || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (jobId, friendName, friendEmail, phoneNumber)' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const referrals = db.collection('referrals');
    const users = db.collection('users');

    // Get user info
    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;
    
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle resume file upload if provided
    let resumeUrl = null;
    let resumeFileName = null;
    if (resumeFile && resumeFile instanceof File) {
      // In a production environment, you would upload to cloud storage (S3, Cloudinary, etc.)
      // For now, we'll store file in local uploads directory
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename - sanitize to avoid issues with spaces and special chars
        const timestamp = Date.now();
        const sanitizedFileName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${sanitizedFileName}`;
        const filePath = path.join(uploadsDir, fileName);

        // Convert File to Buffer and save
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);

        // Verify file was actually saved
        if (!fs.existsSync(filePath)) {
          throw new Error('File was not saved successfully');
        }

        console.log('Resume file saved successfully:', fileName);
        resumeUrl = fileName; // Store relative path (sanitized)
        resumeFileName = resumeFile.name; // Store original filename
      } catch (fileError) {
        console.error('Error saving file:', fileError);
        // Don't store resumeFile if save failed - return error instead
        return NextResponse.json(
          { 
            success: false, 
            error: `Failed to save resume file: ${fileError.message}` 
          },
          { status: 500 }
        );
      }
    }

    // Create referral
    const referral = {
      jobId: typeof jobId === 'string' ? new ObjectId(jobId) : jobId,
      jobRole: jobRole || 'N/A',
      referredBy: userId,
      referrerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      referrerEmail: user.email,
      friendName,
      friendEmail,
      phoneNumber: phoneNumber || '',
      resumeFile: resumeUrl,
      resumeFileName: resumeFileName || (resumeFile instanceof File ? resumeFile.name : null),
      message: message || '',
      status: 'pending', // pending, contacted, hired, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await referrals.insertOne(referral);

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        ...referral,
      },
      message: 'Referral submitted successfully',
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

// GET - Get all referrals (Admin only) or user's own referrals
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
    const users = db.collection('users');
    const referrals = db.collection('referrals');
    const jobs = db.collection('jobs');

    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;
    
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if admin
    const isAdmin = user.role === 'admin';

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const referredBy = searchParams.get('referredBy');

    // Build query
    let query = {};
    
    if (!isAdmin) {
      // Regular users can only see their own referrals
      query.referredBy = userId;
    } else if (referredBy) {
      // Admin can filter by referrer
      query.referredBy = typeof referredBy === 'string' ? new ObjectId(referredBy) : referredBy;
    }

    if (status) {
      query.status = status;
    }

    // Fetch referrals
    const referralsList = await referrals.find(query).sort({ createdAt: -1 }).toArray();

    // Populate job details for each referral
    const referralsWithJobs = await Promise.all(
      referralsList.map(async (referral) => {
        let jobDetails = null;
        if (referral.jobId) {
          jobDetails = await jobs.findOne({ _id: referral.jobId });
        }

        // Get referrer details
        const referrer = await users.findOne({ _id: referral.referredBy });

        return {
          ...referral,
          job: jobDetails ? {
            _id: jobDetails._id,
            title: jobDetails.title,
            company: jobDetails.company,
            location: jobDetails.location,
          } : null,
          referrer: referrer ? {
            _id: referrer._id,
            firstName: referrer.firstName,
            lastName: referrer.lastName,
            email: referrer.email,
          } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: referralsWithJobs,
      count: referralsWithJobs.length,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

