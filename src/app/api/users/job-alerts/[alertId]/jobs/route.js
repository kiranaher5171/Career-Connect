import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getJobAlertById } from '@/lib/models/JobAlert';
import { getAllJobs } from '@/lib/models/Job';
import { findMatchingJobs } from '@/lib/utils/jobMatching';

// GET matched jobs for an alert
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

    const { alertId } = params;
    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    
    const showAll = searchParams.get('showAll') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get alert
    const alert = await getJobAlertById(alertId, userId);
    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Job alert not found' },
        { status: 404 }
      );
    }

    // Get all active jobs
    const allJobs = await getAllJobs({ status: 'active' });

    // Determine which jobs to exclude
    const excludeJobIds = showAll 
      ? [] 
      : (alert.jobsMatched || []).map(id => 
          typeof id === 'object' ? id.toString() : id
        );

    // Find matching jobs
    const matchingJobs = findMatchingJobs(allJobs, alert, excludeJobIds);

    // Calculate new jobs count
    const newJobsCount = showAll ? 0 : matchingJobs.length;

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = matchingJobs.slice(startIndex, endIndex);

    // Convert ObjectIds to strings
    const formattedJobs = paginatedJobs.map(job => ({
      ...job,
      _id: job._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        jobs: formattedJobs,
        total: matchingJobs.length,
        newJobs: newJobsCount,
        page,
        limit,
        totalPages: Math.ceil(matchingJobs.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching matched jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch matched jobs' },
      { status: 500 }
    );
  }
}

