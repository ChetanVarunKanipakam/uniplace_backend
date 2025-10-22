// scheduler.js

import cron from 'node-cron';
import Job from '../models/Job.js'; // Adjust path
import Schedule from '../models/Schedule.js'; // Adjust path
import Notification from '../models/Notification.js'; // Adjust path
import User from '../models/User.js'; // Adjust path

// --- HELPER FUNCTION TO CREATE NOTIFICATIONS WITHOUT DUPLICATES ---
const createNotificationIfNotExists = async (notificationData) => {
    // Check based on recipient, type, and the related job/schedule
    const query = {
        recipient: notificationData.recipient,
        type: notificationData.type,
        jobId: notificationData.jobId,
        scheduleId: notificationData.scheduleId,
    };
    
    const existingNotification = await Notification.findOne(query);
    if (!existingNotification) {
        await Notification.create(notificationData);
    }
};

// --- CRON JOB DEFINITIONS ---

// Job to check for deadlines and schedule reminders once every day at midnight.
const dailyNotificationJob = cron.schedule('0 0 * * *', async () => {
    console.log('Running daily notification check...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
        // 1. Job Deadline Notifications for Recruiters
        const jobsDueToday = await Job.find({
            deadline: { $gte: today, $lt: tomorrow }
        });

        if (jobsDueToday.length > 0) {
            const recruiters = await User.find({ role: 'recruiter' });
            for (const job of jobsDueToday) {
                for (const recruiter of recruiters) {
                    await createNotificationIfNotExists({
                        recipient: recruiter._id,
                        title: 'Job Deadline Today',
                        message: `The application deadline for the job "${job.title}" is today.`,
                        type: 'job_deadline',
                        jobId: job._id,
                    });
                }
            }
        }

        // 2. Schedule Date Reminders for Admins and Recruiters
        const schedulesForToday = await Schedule.find({
            date: { $gte: today, $lt: tomorrow }
        });

        if (schedulesForToday.length > 0) {
            const usersToNotify = await User.find({ role: { $in: ['admin', 'recruiter'] } });
            for (const schedule of schedulesForToday) {
                 for (const user of usersToNotify) {
                    await createNotificationIfNotExists({
                        recipient: user._id,
                        title: 'Schedule Reminder',
                        message: `The event "${schedule.event}" is scheduled for today.`,
                        type: 'schedule_reminder',
                        scheduleId: schedule._id,
                    });
                 }
            }
        }
    } catch (error) {
        console.error('Error running daily notification job:', error);
    }
}, {
    scheduled: false, // Don't start automatically
    timezone: "UTC" // Or your target timezone
});


// --- EXPORT FUNCTIONS TO START/STOP JOBS ---
export const start = () => {
    console.log('Starting scheduler...');
    dailyNotificationJob.start();
};

export const stop = () => {
    console.log('Stopping scheduler...');
    dailyNotificationJob.stop();
};