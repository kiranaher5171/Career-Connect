import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getJobAlertById,
  updateJobAlert,
  deleteJobAlert,
} from '@/lib/models/JobAlert';

// GET a single job alert
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

    const alert = await getJobAlertById(alertId, userId);

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Job alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...alert,
        _id: alert._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching job alert:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch job alert' },
      { status: 500 }
    );
  }
}

// PUT update a job alert
export async function PUT(request, { params }) {
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
    const body = await request.json();

    // Validate alert exists and belongs to user
    const existingAlert = await getJobAlertById(alertId, userId);
    if (!existingAlert) {
      return NextResponse.json(
        { success: false, error: 'Job alert not found' },
        { status: 404 }
      );
    }

    const result = await updateJobAlert(alertId, userId, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update job alert' },
        { status: 400 }
      );
    }

    // Return updated alert
    const updatedAlert = await getJobAlertById(alertId, userId);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedAlert,
        _id: updatedAlert._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating job alert:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update job alert' },
      { status: 500 }
    );
  }
}

// DELETE a job alert
export async function DELETE(request, { params }) {
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

    const result = await deleteJobAlert(alertId, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Job alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job alert deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job alert:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete job alert' },
      { status: 500 }
    );
  }
}

