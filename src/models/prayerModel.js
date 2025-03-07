const mongoose = require('mongoose');
const {PRAYER_NAMES, PRAYER_STATUSES} = require('../utils/prayer');

const prayersSchema = new mongoose.Schema(
  {
    prayers: [
      {
        prayerStatus: [
          {
            prayerName: {
              type: String,
              enum: Object.values(PRAYER_NAMES),
              required: true,
            },
            status: {
              type: String,
              enum: Object.values(PRAYER_STATUSES),
              required: true,
            },
          },
        ],
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
  },
  {timestamps: true}
);

const Prayer = mongoose.model('Prayers', prayersSchema);
module.exports = Prayer;
