const cron = require('node-cron');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel'); // Adjust the path as necessary
const PrayerModel = require('../models/prayerModel'); // Adjust the path as necessary
const {PRAYER_NAMES, PRAYER_STATUSES} = require('../utils/prayer'); // Adjust the path as necessary
const {ROLES} = require('./user');
const CronJobLog = require('../models/cronJobLog');

// Function to update prayers for users with specific roles
const updatePrayersForUsers = async () => {
  try {
    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to the start of the day

    // Check if the cron job has already run today
    const jobLog = await CronJobLog.findOne({lastRun: {$gte: currentDate}});
    if (jobLog && jobLog.lastRun >= currentDate) {
      console.log('Cron job already ran today. Skipping...');
      return;
    }

    // Find all users with the specified roles
    const users = await UserModel.find({role: ROLES.USER}); // Adjust roles as necessary

    // Loop through each user
    for (const user of users) {
      // Create a new prayers document for the current date
      const newPrayers = {
        prayers: [
          {
            prayerStatus: Object.values(PRAYER_NAMES).map((prayerName) => ({
              prayerName,
              status: PRAYER_STATUSES.OFFER, // Set status to "offer"
            })),
            date: currentDate,
          },
        ],
      };

      // Update the user's prayers document
      await PrayerModel.findByIdAndUpdate(
        user.prayers,
        {$push: {prayers: newPrayers.prayers}},
        {new: true, upsert: true}
      );
    }

    // Log the cron job's last run time
    await CronJobLog.findOneAndUpdate(
      {jobName: 'updatePrayers'},
      {lastRun: currentDate},
      {upsert: true}
    );

    console.log('Prayers updated successfully for all users.');
  } catch (error) {
    console.error('Error updating prayers:', error);
  }
};

// Schedule the cron job to run every day at 12 AM
cron.schedule(
  '0 0 * * *',
  () => {
    console.log('Running cron job to update prayers...');
    updatePrayersForUsers();
  },
  {scheduled: true, timezone: 'UTC'}
);

// Export the function for testing purposes
module.exports = {updatePrayersForUsers};
