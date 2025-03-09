const User = require('../../models/userModel');
const Prayer = require('../../models/prayerModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const updatePrayerStatus = catchAsync(async (req, res) => {
  // Get userId from params, body, or authenticated user
  const userId = req.user._id;

  // Find the user and their prayer document
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Format date to remove time component
  const prayerDate = new Date(req.body.date);
  const formattedDate = new Date(prayerDate.toISOString().split('T')[0]);

  // Find user's prayer document
  const prayerDoc = await Prayer.findById(user.prayers);
  if (!prayerDoc) throw new AppError('Prayer document not found', 404);

  // Find the prayer entry for the specified date
  const prayerEntry = prayerDoc.prayers.find(
    (entry) =>
      new Date(entry.date).toISOString().split('T')[0] ===
      formattedDate.toISOString().split('T')[0]
  );

  if (!prayerEntry)
    throw new AppError('Prayer entry for this date not found', 404);

  // Find the specific prayer to update
  const prayerToUpdate = prayerEntry.prayerStatus.find(
    (prayer) => prayer.prayerName === req.body.prayerName
  );

  if (!prayerToUpdate) {
    // If prayer doesn't exist in the status array, add it
    prayerEntry.prayerStatus.push({
      prayerName: req.body.prayerName,
      status: req.body.status,
    });
  } else {
    // Update existing prayer status
    prayerToUpdate.status = req.body.status;
  }

  // Save the updated document
  await prayerDoc.save();

  res.status(200).json({
    status: 'success',
    data: {
      prayer: prayerDoc,
      updatedPrayer: {
        prayerName: req.body.prayerName,
        status: req.body.status,
        date: formattedDate,
      },
    },
  });
});

module.exports = {
  updatePrayerStatus,
};
