import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET all users with their stats (saved jobs count, applications count, referral count)
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

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const users = db.collection('users');
    
    const userId = typeof decoded.userId === 'string' 
      ? new ObjectId(decoded.userId) 
      : decoded.userId;
    
    const adminUser = await users.findOne({ _id: userId });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all users
    const allUsers = await users.find({}).toArray();

    // Get collections for stats
    const savedJobs = db.collection('savedJobs');
    const applications = db.collection('applications');
    const referrals = db.collection('referrals');

    // Get stats for each user
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const userId = user._id.toString();
        const userIdObjectId = user._id;
        
        // Count saved jobs (try both string and ObjectId formats using $or)
        const savedJobsCount = await savedJobs.countDocuments({
          $or: [
            { userId: userId },
            { userId: userIdObjectId }
          ]
        });
        
        // Count applications (try both string and ObjectId formats using $or)
        const applicationsCount = await applications.countDocuments({
          $or: [
            { userId: userId },
            { userId: userIdObjectId }
          ]
        });
        
        // Count referrals (try both string and ObjectId formats using $or)
        const referralsCount = await referrals.countDocuments({
          $or: [
            { referredBy: userId },
            { referredBy: userIdObjectId }
          ]
        });

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin || user.createdAt, // Use createdAt as fallback
          savedJobsCount,
          applicationsCount,
          referralsCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: usersWithStats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

