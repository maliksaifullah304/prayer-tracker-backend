const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    youtubeLink: {
      type: String,
    },
  },
  {timestamps: true}
);

const Guidance = mongoose.model('Guidance', guidanceSchema);
module.exports = Guidance;
