const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  startTime: {
    type: String, // Store as "10:00 AM" for simplicity in this project
    required: true
  },
  screen: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
