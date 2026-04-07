const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  rows: { type: Number, required: true },
  cols: { type: Number, required: true }
});

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  basePrice: { type: Number, required: true },
  screens: [screenSchema]
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);
