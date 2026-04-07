const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: String, required: true },
  duration: { type: String, required: true },
  releaseDate: { type: String, required: true },
  poster: { type: String, required: true },
  backdrop: { type: String, required: true },
  trailerUrl: { type: String, default: '' },

  status: { type: String, enum: ['Now Playing', 'Coming Soon'], default: 'Now Playing' },
  cast: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
