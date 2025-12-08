import { NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/db/models/Job';

// GET job by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const job = await getJobById(id);
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT update job
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Convert skills string to array if needed
    if (body.skills && typeof body.skills === 'string') {
      body.skills = body.skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const result = await updateJob(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Job not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteJob(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}

