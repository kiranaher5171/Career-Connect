import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

// Create a new job alert
export async function createJobAlert(userId, alertData) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobAlerts = db.collection('jobAlerts');

    const newAlert = {
      userId: userId,
      alertName: alertData.alertName,
      isActive: alertData.isActive !== undefined ? alertData.isActive : true,
      emailNotifications: alertData.emailNotifications !== undefined ? alertData.emailNotifications : true,
      notificationFrequency: alertData.notificationFrequency || 'daily',
      keywords: alertData.keywords || '',
      locations: alertData.locations || [],
      categories: alertData.categories || [],
      jobTypes: alertData.jobTypes || [],
      experienceLevels: alertData.experienceLevels || [],
      salaryRange: alertData.salaryRange || { min: 0, max: 10000000 },
      skills: alertData.skills || [],
      lastChecked: new Date(),
      jobsMatched: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await jobAlerts.insertOne(newAlert);
    return { success: true, alertId: result.insertedId, alert: newAlert };
  } catch (error) {
    throw error;
  }
}

// Get all job alerts for a user
export async function getUserJobAlerts(userId) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobAlerts = db.collection('jobAlerts');

    // Try both string and ObjectId formats
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    const alerts = await jobAlerts
      .find({
        $or: [
          { userId: userId },
          { userId: userIdQuery }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return alerts;
  } catch (error) {
    throw error;
  }
}

// Get a single job alert by ID
export async function getJobAlertById(alertId, userId) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobAlerts = db.collection('jobAlerts');

    let alertObjectId;
    try {
      alertObjectId = typeof alertId === 'string' ? new ObjectId(alertId) : alertId;
    } catch (error) {
      throw new Error('Invalid alert ID');
    }

    // Try both string and ObjectId formats for userId
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    const alert = await jobAlerts.findOne({
      _id: alertObjectId,
      $or: [
        { userId: userId },
        { userId: userIdQuery }
      ]
    });

    return alert;
  } catch (error) {
    throw error;
  }
}

// Update a job alert
export async function updateJobAlert(alertId, userId, updateData) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobAlerts = db.collection('jobAlerts');

    let alertObjectId;
    try {
      alertObjectId = typeof alertId === 'string' ? new ObjectId(alertId) : alertId;
    } catch (error) {
      throw new Error('Invalid alert ID');
    }

    // Try both string and ObjectId formats for userId
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    const updateFields = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await jobAlerts.updateOne(
      {
        _id: alertObjectId,
        $or: [
          { userId: userId },
          { userId: userIdQuery }
        ]
      },
      { $set: updateFields }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    throw error;
  }
}

// Delete a job alert
export async function deleteJobAlert(alertId, userId) {
  try {
    const client = await clientPromise;
    const db = client.db('careerconnect');
    const jobAlerts = db.collection('jobAlerts');

    let alertObjectId;
    try {
      alertObjectId = typeof alertId === 'string' ? new ObjectId(alertId) : alertId;
    } catch (error) {
      throw new Error('Invalid alert ID');
    }

    // Try both string and ObjectId formats for userId
    let userIdQuery;
    try {
      userIdQuery = new ObjectId(userId);
    } catch (error) {
      userIdQuery = userId;
    }

    const result = await jobAlerts.deleteOne({
      _id: alertObjectId,
      $or: [
        { userId: userId },
        { userId: userIdQuery }
      ]
    });

    return { success: result.deletedCount > 0 };
  } catch (error) {
    throw error;
  }
}

// Toggle alert active status
export async function toggleJobAlert(alertId, userId) {
  try {
    const alert = await getJobAlertById(alertId, userId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const result = await updateJobAlert(alertId, userId, {
      isActive: !alert.isActive
    });

    return { success: result.success, isActive: !alert.isActive };
  } catch (error) {
    throw error;
  }
}

