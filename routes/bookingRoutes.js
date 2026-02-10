const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const createBookingValidation = [
  body('room')
    .notEmpty()
    .withMessage('Room ID is required'),
  body('checkInDate')
    .isISO8601()
    .withMessage('Valid check-in date is required'),
  body('checkOutDate')
    .isISO8601()
    .withMessage('Valid check-out date is required'),
  body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('guestName')
    .trim()
    .notEmpty()
    .withMessage('Guest name is required'),
  body('guestEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid guest email is required'),
  body('guestPhone')
    .trim()
    .notEmpty()
    .withMessage('Guest phone number is required')
];

router.use(protect);

router.post('/', createBookingValidation, createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.put('/:id/cancel', cancelBooking);

router.get('/all/bookings', authorize('admin', 'manager'), getAllBookings);

router.delete('/:id', authorize('admin'), deleteBooking);

module.exports = router;
