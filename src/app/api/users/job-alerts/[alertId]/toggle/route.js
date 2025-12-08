import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { toggleJobAlert } from '@/lib/db/models/JobAlert';

// PATCH toggle alert active status
export async function PATCH(request, { params }) {
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

    const result = await toggleJobAlert(alertId, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Job alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isActive: result.isActive,
      },
    });
  } catch (error) {
    console.error('Error toggling job alert:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle job alert' },
      { status: 500 }
    );
  }
}

