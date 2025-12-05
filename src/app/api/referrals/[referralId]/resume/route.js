import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

// GET - Download referral resume (Admin only)
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

    const client = await clientPromise;
    const db = client.db('careerconnect');
    const users = db.collection('users');

    // Get user info and verify admin
    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;
    
    const user = await users.findOne({ _id: userId });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get referral ID from params
    const { referralId } = await params;
    const referralObjectId = typeof referralId === 'string' ? new ObjectId(referralId) : referralId;

    // Get referral data
    const referrals = db.collection('referrals');
    const referral = await referrals.findOne({ _id: referralObjectId });

    if (!referral) {
      return NextResponse.json(
        { success: false, error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Check if resume file exists
    if (!referral.resumeFile && !referral.resumeFileName) {
      return NextResponse.json(
        { success: false, error: 'Resume file not found for this referral' },
        { status: 404 }
      );
    }

    // For now, if resumeFile is a URL or path, return it
    // In production, you would fetch from cloud storage (S3, Cloudinary, etc.)
    if (referral.resumeFile) {
      // If it's a URL, redirect to it
      if (referral.resumeFile.startsWith('http://') || referral.resumeFile.startsWith('https://')) {
        return NextResponse.redirect(referral.resumeFile);
      }

      // If it's a local file path, try to read and serve it
      // This is for development - in production, use cloud storage
      try {
        const filePath = path.join(process.cwd(), 'uploads', 'resumes', referral.resumeFile);
        
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const fileName = referral.resumeFileName || referral.resumeFile.split('/').pop() || 'resume.pdf';
          
          // Determine content type based on file extension
          const ext = fileName.split('.').pop().toLowerCase();
          const contentTypeMap = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          };
          const contentType = contentTypeMap[ext] || 'application/octet-stream';

          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${fileName}"`,
            },
          });
        }
      } catch (fileError) {
        console.error('Error reading file:', fileError);
      }
    }

    // If file doesn't exist locally, return error
    return NextResponse.json(
      { success: false, error: 'Resume file not found on server' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error downloading referral resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}

