require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const Room = require('./models/Room.js');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@hotel.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: 'admin'
    });
    console.log('Created admin user');

    const managerPassword = await bcrypt.hash('manager123', 10);
    await User.create({
      username: 'manager',
      email: 'manager@hotel.com',
      password: managerPassword,
      firstName: 'Manager',
      lastName: 'User',
      phoneNumber: '+1111111111',
      role: 'manager'
    });
    console.log('Created manager user');

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+0987654321',
      role: 'user'
    });
    console.log('Created regular user');

    const rooms = [
      {
        roomNumber: '101',
        type: 'Single',
        price: 80,
        capacity: 1,
        description: 'Cozy single room with city view',
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        floor: 1,
        isAvailable: true
      },
      {
        roomNumber: '102',
        type: 'Single',
        price: 85,
        capacity: 1,
        description: 'Comfortable single room with balcony',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Balcony'],
        floor: 1,
        isAvailable: true
      },
      {
        roomNumber: '201',
        type: 'Double',
        price: 120,
        capacity: 2,
        description: 'Spacious double room with king-size bed',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
        floor: 2,
        isAvailable: true
      },
      {
        roomNumber: '202',
        type: 'Double',
        price: 130,
        capacity: 2,
        description: 'Luxurious double room with sea view',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sea View'],
        floor: 2,
        isAvailable: true
      },
      {
        roomNumber: '301',
        type: 'Suite',
        price: 200,
        capacity: 3,
        description: 'Executive suite with separate living area',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Room', 'Bathtub'],
        floor: 3,
        isAvailable: true
      },
      {
        roomNumber: '302',
        type: 'Suite',
        price: 220,
        capacity: 3,
        description: 'Premium suite with panoramic view',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Room', 'Balcony', 'Bathtub'],
        floor: 3,
        isAvailable: true
      },
      {
        roomNumber: '401',
        type: 'Deluxe',
        price: 300,
        capacity: 4,
        description: 'Deluxe room with premium amenities',
        amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Bathtub', 'Work Desk'],
        floor: 4,
        isAvailable: true
      },
      {
        roomNumber: 'PH01',
        type: 'Presidential',
        price: 500,
        capacity: 6,
        description: 'Presidential suite with luxury furnishings',
        amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Dining Room', 'Living Room', 'Jacuzzi', '2 Bathrooms', 'Private Terrace'],
        floor: 5,
        isAvailable: true
      }
    ];

    await Room.insertMany(rooms);
    console.log('Created sample rooms');

    console.log('\n=================================');
    console.log('Seed data created successfully!');
    console.log('=================================');
    console.log('\nTest Credentials:');
    console.log('------------------');
    console.log('Admin User:');
    console.log('  Email: admin@hotel.com');
    console.log('  Password: admin123');
    console.log('\nRegular User:');
    console.log('  Email: john@example.com');
    console.log('  Password: user123');
    console.log('\nManager User:');
    console.log('  Email: manager@hotel.com');
    console.log('  Password: manager123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
