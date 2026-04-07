const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    title: { type: String, required: true },
    poster: { type: String, required: true },
    id: { type: String, required: true }
  },
  theater: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    id: { type: String, required: true }
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
