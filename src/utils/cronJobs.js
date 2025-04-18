const cron = require('node-cron');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel'); // Adjust the path as necessary
const PrayerModel = require('../models/prayerModel'); // Adjust the path as necessary
const {PRAYER_NAMES, PRAYER_STATUSES} = require('../utils/prayer'); // Adjust the path as necessary
const {ROLES} = require('./user');
const CronJobLog = require('../models/cronJobLog');
const moment = require('moment');

// Function to update prayers for users with specific roles
const updatePrayersForUsers = async () => {
  try {
    const todayDate = moment().utc().startOf('day');

    // Check if the cron job has already run today
    const jobLog = await CronJobLog.findOne({
      lastRun: {$gte: todayDate.toDate()},
    });

    if (jobLog) {
      console.log('Cron job already ran today. Skipping...');
      return;
    }

    // Find all users with the specified roles
    const users = await UserModel.find({role: ROLES.USER});

    for (const user of users) {
      const newPrayerEntry = {
        prayerStatus: Object.values(PRAYER_NAMES).map((prayerName) => ({
          prayerName,
          status: PRAYER_STATUSES.OFFER,
        })),
        date: todayDate.toDate(),
      };

      await PrayerModel.findByIdAndUpdate(
        user.prayers,
        {$push: {prayers: newPrayerEntry}},
        {new: true, upsert: true}
      );
    }

    // Log the cron job's last run time
    await CronJobLog.findOneAndUpdate(
      {jobName: 'updatePrayers'},
      {lastRun: new Date()},
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
