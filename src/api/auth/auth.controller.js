const mongoose = require('mongoose');
const Prayer = require('../../models/prayerModel');
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {PRAYER_NAMES, PRAYER_STATUSES} = require('../../utils/prayer');
const {ROLES} = require('../../utils/user');

const createUser = catchAsync(async (req, res) => {
  // Start a MongoDB session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Set role to 'user'
    req.body.role = 'user';

    // Create prayer document with all prayers for current day marked as offered
    const prayerDoc = await Prayer.create(
      [
        {
          prayers: [
            {
              prayerStatus: Object.values(PRAYER_NAMES).map((prayerName) => ({
                prayerName,
                status: PRAYER_STATUSES.OFFER,
              })),
              date: new Date(),
            },
          ],
        },
      ],
      {session}
    );

    // Add prayer document reference to user
    req.body.prayers = prayerDoc[0]._id;

    // Create user with reference to prayer document
    const user = await User.create([req.body], {session});

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Prepare response (excluding password)
    const {password, ...userResponse} = user[0]._doc;

    // Send response
    res.status(201).json({
      status: 'success',
      data: {
        user: userResponse,
        prayer: prayerDoc[0],
      },
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    // Forward error to error handler
    throw error;
  }
});

const login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user || !(await bcrypt.compareSync(password, user.password)))
    return next(new AppError('Invalid email or password.', 401));

  if (!user.isActive)
    return next(new AppError('Your account is blocked contact admin', 401));

  const {password: userPassword, ...userInfo} = user._doc;
  const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookiesOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 96 * 60 * 60 * 1000,
  };
  res.cookie(process.env.TOKEN_VARIABLE, token, cookiesOpts);

  res.status(200).json({message: 'Login successful', userInfo});
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie(process.env.TOKEN_VARIABLE);

  res.status(200).json({message: 'Logout successful'});
});

const deActivateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {isActive: false});
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const activateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {isActive: true});
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({role: ROLES.USER})
    .select('-password')
    .populate({
      path: 'prayers',
      model: 'Prayers',
    });

  const usersWithPrayerCounts = users.map((user) => {
    let offerCount = 0;
    let missedCount = 0;

    if (user.prayers && Array.isArray(user.prayers.prayers)) {
      user.prayers.prayers.forEach((prayerEntry) => {
        prayerEntry.prayerStatus.forEach((prayer) => {
          if (prayer.status === 'Offer') offerCount++;
          if (prayer.status === 'Missed') missedCount++;
        });
      });
    }

    const {prayers, ...rest} = user.toObject();

    return {
      ...rest,
      totalOfferPrayers: offerCount,
      totalMissedPrayers: missedCount,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      users: usersWithPrayerCounts,
    },
  });
});

module.exports = {
  createUser,
  login,
  deActivateUser,
  getAllUsers,
  activateUser,
  logout,
};
