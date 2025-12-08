import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  createJobAlert,
  getUserJobAlerts,
} from '@/lib/db/models/JobAlert';
import { getAllJobs } from '@/lib/db/models/Job';
import { getNewJobsCount } from '@/utils/jobMatching';

// GET all job alerts for current user
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

    const userId = decoded.userId;
    const alerts = await getUserJobAlerts(userId);

    // Get all active jobs to calculate new jobs count
    const allJobs = await getAllJobs({ status: 'active' });

    // Add new jobs count to each alert
    const alertsWithCounts = alerts.map(alert => {
      const newJobsCount = getNewJobsCount(allJobs, alert);
      return {
        ...alert,
        _id: alert._id.toString(),
        newJobsCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: alertsWithCounts,
    });
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job alerts' },
      { status: 500 }
    );
  }
}

// POST create a new job alert
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
    const userId = decoded.userId;

    // Validate required fields
    if (!body.alertName || body.alertName.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Alert name is required' },
        { status: 400 }
      );
    }

    const result = await createJobAlert(userId, body);

    return NextResponse.json({
      success: true,
      data: {
        ...result.alert,
        _id: result.alertId.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating job alert:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create job alert' },
      { status: 500 }
    );
  }
}

