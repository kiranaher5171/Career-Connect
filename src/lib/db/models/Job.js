import clientPromise from '../mongodb';

export async function createJob(jobData) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');

    // Generate slug from job title
    const slug = jobData.jobRole
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingJob = await jobs.findOne({ slug });
    if (existingJob) {
      // Append timestamp to make it unique
      const uniqueSlug = `${slug}-${Date.now()}`;
      jobData.slug = uniqueSlug;
    } else {
      jobData.slug = slug;
    }

    // Create job object
    const newJob = {
      ...jobData,
      status: jobData.status || 'active', // active, draft, closed
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert job
    const result = await jobs.insertOne(newJob);
    return { success: true, jobId: result.insertedId, slug: jobData.slug };
  } catch (error) {
    throw error;
  }
}

export async function getAllJobs(filters = {}) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');

    // Build query
    const query = {};
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }
    if (filters.experience) {
      query.experience = filters.experience;
    }

    const allJobs = await jobs.find(query).sort({ createdAt: -1 }).toArray();
    return allJobs;
  } catch (error) {
    throw error;
  }
}

export async function getJobBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');
    return await jobs.findOne({ slug });
  } catch (error) {
    throw error;
  }
}

export async function getJobById(id) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');
    const ObjectId = require('mongodb').ObjectId;
    return await jobs.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw error;
  }
}

export async function updateJob(id, jobData) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');
    const ObjectId = require('mongodb').ObjectId;

    // If jobRole changed, update slug
    if (jobData.jobRole) {
      const existingJob = await jobs.findOne({ _id: new ObjectId(id) });
      if (existingJob && existingJob.jobRole !== jobData.jobRole) {
        const slug = jobData.jobRole
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        const slugExists = await jobs.findOne({ slug, _id: { $ne: new ObjectId(id) } });
        if (slugExists) {
          jobData.slug = `${slug}-${Date.now()}`;
        } else {
          jobData.slug = slug;
        }
      }
    }

    const updatedJob = {
      ...jobData,
      updatedAt: new Date(),
    };

    const result = await jobs.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedJob }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    throw error;
  }
}

export async function deleteJob(id) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobs = db.collection('jobs');
    const ObjectId = require('mongodb').ObjectId;

    const result = await jobs.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    throw error;
  }
}

