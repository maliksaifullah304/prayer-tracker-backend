const Guidance = require('../../models/guidanceModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.createGuidance = catchAsync(async (req, res, next) => {
  const {title, description, youtubeLink} = req.body;

  const newGuidance = await Guidance.create({title, description, youtubeLink});

  res.status(201).json({
    status: 'success',
    data: newGuidance,
  });
});

exports.updateGuidance = catchAsync(async (req, res, next) => {
  const {id} = req.params;

  const updatedGuidance = await Guidance.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedGuidance) {
    return next(new AppError('No guidance found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedGuidance,
  });
});

exports.getAllGuidance = catchAsync(async (req, res, next) => {
  const allGuidance = await Guidance.find();

  res.status(200).json({
    status: 'success',
    data: allGuidance,
  });
});

exports.deleteGuidance = catchAsync(async (req, res, next) => {
  const {id} = req.params;

  const deletedGuidance = await Guidance.findByIdAndDelete(id);

  if (!deletedGuidance) {
    return next(new AppError('No guidance found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
