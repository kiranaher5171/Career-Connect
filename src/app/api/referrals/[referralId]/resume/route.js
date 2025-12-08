import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
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
    
    if (!referralId) {
      return NextResponse.json(
        { success: false, error: 'Referral ID is required' },
        { status: 400 }
      );
    }

    let referralObjectId;
    try {
      referralObjectId = typeof referralId === 'string' ? new ObjectId(referralId) : referralId;
    } catch (idError) {
      console.error('Invalid referral ID format:', referralId, idError);
      return NextResponse.json(
        { success: false, error: 'Invalid referral ID format' },
        { status: 400 }
      );
    }

    // Get referral data
    const referrals = db.collection('referrals');
    const referral = await referrals.findOne({ _id: referralObjectId });

    if (!referral) {
      console.error('Referral not found:', referralId);
      return NextResponse.json(
        { success: false, error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Check if resume file exists
    if (!referral.resumeFile && !referral.resumeFileName) {
      console.error('No resume file found for referral:', referralId);
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
        const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
          console.log('Created uploads directory:', uploadsDir);
        }
        
        // Try multiple file path patterns since filenames might have been sanitized
        let filePath = path.join(uploadsDir, referral.resumeFile);
        let foundFile = null;
        let actualFileName = referral.resumeFile;
        
        // First, try the exact filename from database
        if (fs.existsSync(filePath)) {
          foundFile = filePath;
          actualFileName = referral.resumeFile;
        } else {
          // Try sanitized version (spaces replaced with underscores)
          const sanitizedFileName = referral.resumeFile.replace(/[^a-zA-Z0-9.-]/g, '_');
          const sanitizedPath = path.join(uploadsDir, sanitizedFileName);
          if (fs.existsSync(sanitizedPath)) {
            foundFile = sanitizedPath;
            actualFileName = sanitizedFileName;
          } else {
            // Try to find file by timestamp (extract timestamp from filename)
            // Pattern: resume_TIMESTAMP_filename or TIMESTAMP_filename
            const timestampMatch = referral.resumeFile.match(/(\d+)_/);
            if (timestampMatch) {
              const timestamp = timestampMatch[1];
              // List all files and find one that starts with the timestamp
              if (fs.existsSync(uploadsDir)) {
                const files = fs.readdirSync(uploadsDir);
                const matchingFile = files.find(f => f.startsWith(timestamp + '_') || f.includes(timestamp));
                if (matchingFile) {
                  foundFile = path.join(uploadsDir, matchingFile);
                  actualFileName = matchingFile;
                }
              }
            }
          }
        }
        
        console.log('Looking for file at:', filePath);
        console.log('File exists:', fs.existsSync(filePath));
        console.log('Referral resumeFile value:', referral.resumeFile);
        
        if (foundFile && fs.existsSync(foundFile)) {
          const fileBuffer = fs.readFileSync(foundFile);
          // Use the original filename from database for download, or the actual file name
          const fileName = referral.resumeFileName || actualFileName.split('/').pop() || 'resume.pdf';
          
          // Determine content type based on file extension
          const ext = fileName.split('.').pop().toLowerCase();
          const contentTypeMap = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          };
          const contentType = contentTypeMap[ext] || 'application/octet-stream';

          console.log('Serving file:', fileName, 'Content-Type:', contentType);
          console.log('Actual file path:', foundFile);
          
          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${fileName}"`,
            },
          });
        } else {
          console.error('File does not exist at path:', filePath);
          console.error('Referral resumeFile value:', referral.resumeFile);
          console.error('Uploads directory exists:', fs.existsSync(uploadsDir));
          
          // List files in uploads directory for debugging
          if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.error('Files in uploads/resumes:', files);
          }
          
          // Return a more helpful error message
          const availableFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
          return NextResponse.json(
            { 
              success: false, 
              error: 'Resume file not found on server. The file may have been deleted or never uploaded properly when the referral was created.',
              message: 'The resume file does not exist. Please contact the administrator or re-upload the resume for this referral.',
              details: {
                expectedFile: referral.resumeFile,
                uploadsDirectory: uploadsDir,
                availableFiles: availableFiles,
                fileCount: availableFiles.length
              }
            },
            { 
              status: 404,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }
      } catch (fileError) {
        console.error('Error reading file:', fileError);
        return NextResponse.json(
          { success: false, error: `Error reading file: ${fileError.message}` },
          { status: 500 }
        );
      }
    }

    // If file doesn't exist locally, return error
    console.error('Resume file not found on server for referral:', referralId);
    return NextResponse.json(
      { success: false, error: 'Resume file not found on server. Please check if the file exists in uploads/resumes directory.' },
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

