import { NextResponse } from 'next/server';
import { getAllJobs, createJob } from '@/lib/db/models/Job';

// GET all jobs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || 'active',
      location: searchParams.get('location'),
      jobType: searchParams.get('jobType'),
      experience: searchParams.get('experience'),
    };

    const jobs = await getAllJobs(filters);
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST create new job
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['jobRole', 'jobType', 'location', 'experience', 'jobDescription'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Convert skills string to array if needed
    if (body.skills && typeof body.skills === 'string') {
      body.skills = body.skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const result = await createJob(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}

