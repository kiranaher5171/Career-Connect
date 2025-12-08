import { NextResponse } from 'next/server';
import { getJobBySlug } from '@/lib/db/models/Job';

// GET job by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const job = await getJobBySlug(slug);
    
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

