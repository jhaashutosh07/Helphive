const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

helpRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
