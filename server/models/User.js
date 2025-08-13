const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // ✅ This is good but make sure backend uses 'passwordHash' not 'password'
  passwordHash: { type: String, required: true },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },

  karma: { type: Number, default: 0 }

}, { timestamps: true });

// ✅ Enables geospatial queries
UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
