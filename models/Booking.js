const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Booking must have a room']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please provide check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please provide check-out date']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Please provide number of guests'],
    min: [1, 'Number of guests must be at least 1']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  guestName: {
    type: String,
    required: [true, 'Please provide guest name']
  },
  guestEmail: {
    type: String,
    required: [true, 'Please provide guest email']
  },
  guestPhone: {
    type: String,
    required: [true, 'Please provide guest phone number']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  this.updatedAt = Date.now();
  next();
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
