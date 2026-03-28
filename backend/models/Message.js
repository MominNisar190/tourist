const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  guests:      { type: Number, default: 1 },
  tour:        { type: String, default: '' },
  travelDate:  { type: String, default: '' },
  country:     { type: String, default: '' },
  message:     { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
