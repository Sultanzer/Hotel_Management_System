const express = require('express');
const { body } = require('express-validator');
const {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const createRoomValidation = [
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),
  body('type')
    .isIn(['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'])
    .withMessage('Invalid room type'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1')
];

router.get('/', getAllRooms);
router.get('/:id', getRoom);
router.post('/:id/check-availability', checkAvailability);

router.post('/', protect, authorize('admin', 'manager'), createRoomValidation, createRoom);
router.put('/:id', protect, authorize('admin', 'manager'), updateRoom);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteRoom);

module.exports = router;
