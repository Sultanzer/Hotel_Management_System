  # Hotel Management System

A comprehensive hotel management system with booking functionality built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Project Overview

This is a full-stack web application that allows users to:
- Browse available hotel rooms
- Create bookings with date validation
- Manage their bookings (view, cancel)
- Update their profile
- Receive email confirmations

Admin users can:
- Add, update, and delete rooms
- View all bookings
- Manage users
- Control room availability

## Features

### User Features
-  User registration and authentication with JWT
-  Browse and filter available rooms
-  Book rooms with date validation
-  View booking history
-  Cancel bookings
-  Update profile information
-  Email notifications for bookings

### Staff Features (RBAC)
-  Admin dashboard
-  Manage rooms (Create, Read, Update, Delete)
-  View all bookings
-  Manage users
-  Role-based access control (Guest, User, Manager, Admin)

Manager users can:
- Create/update/delete rooms
- View all bookings
- Update booking status (e.g., confirm, complete, cancel)

### Technical Features
-  RESTful API architecture
-  JWT authentication
-  Password encryption with bcrypt
-  MongoDB database with Mongoose ODM
-  Email service integration with Nodemailer
-  Input validation
-  Error handling middleware
-  Responsive design (mobile & desktop)
-  Role-based access control

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt.js
- Nodemailer
- Express Validator

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- Fetch API

## Project Structure


hotel-management-system/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── roomController.js    # Room management
│   │   └── bookingController.js # Booking management
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Room.js              # Room schema
│   │   └── Booking.js           # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── roomRoutes.js        # Room endpoints
│   │   └── bookingRoutes.js     # Booking endpoints
│   └── utils/
│       └── emailService.js      # Email utilities
├── public/
│   ├── css/
│   │   └── style.css            # Styles
│   ├── js/
│   │   └── app.js               # Frontend logic
│   └── index.html               # Main HTML file
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
├── server.js                    # Entry point
└── README.md                    # Documentation


##  Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

### Clone the repository

git clone <repository-url>
cd hotel-management-system

### Install dependencies

npm install

### Running the Application

**Development Mode**

npm run dev


**Production Mode**

npm start

The application will be available at `http://localhost:5000`

## API Documentation

### Base URL

http://localhost:5000/api


### Authentication Endpoints

#### Register User

POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}


#### Login

POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}


### User Endpoints (Protected)

#### Get Profile

GET /users/profile
Authorization: Bearer <token>


#### Update Profile

PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+0987654321"
}


#### Get All Users (Admin Only)

GET /users
Authorization: Bearer <admin_token>


#### Delete User (Admin Only)

DELETE /users/:id
Authorization: Bearer <admin_token>


### Room Endpoints

#### Get All Rooms (Public)

GET /rooms
Optional Query Parameters:
  - type: Single|Double|Suite|Deluxe|Presidential
  - minPrice: number
  - maxPrice: number
  - isAvailable: boolean

Example: GET /rooms?type=Suite&minPrice=100&maxPrice=300


#### Get Single Room (Public)

GET /rooms/:id


#### Create Room (Admin/Manager)

POST /rooms
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "roomNumber": "101",
  "type": "Single",
  "price": 100,
  "capacity": 1,
  "description": "Cozy single room",
  "floor": 1
}


#### Update Room (Admin/Manager)

PUT /rooms/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 120,
  "isAvailable": true
}


#### Delete Room (Admin/Manager)

DELETE /rooms/:id
Authorization: Bearer <admin_token>

#### Check Room Availability (Public)

POST /rooms/:id/check-availability
Content-Type: application/json

{
  "checkInDate": "2025-03-01",
  "checkOutDate": "2025-03-05"
}

### Booking Endpoints (Protected)

#### Create Booking

POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "room": "room_id",
  "checkInDate": "2025-03-01",
  "checkOutDate": "2025-03-05",
  "numberOfGuests": 2,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "specialRequests": "Late check-in please"
}

#### Get My Bookings

GET /bookings
Authorization: Bearer <token>

#### Get Single Booking

GET /bookings/:id
Authorization: Bearer <token>

#### Update Booking

PUT /bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "numberOfGuests": 3,
  "specialRequests": "Need extra towels"
}

#### Cancel Booking

PUT /bookings/:id/cancel
Authorization: Bearer <token>

#### Get All Bookings (Admin/Manager)

GET /bookings/all/bookings
Authorization: Bearer <admin_token>

#### Delete Booking (Admin Only)

DELETE /bookings/:id
Authorization: Bearer <admin_token>


### Home Page
- Hero section with call-to-action
- Feature showcase
- Responsive navigation

### Rooms Page
- Browse all available rooms
- Filter by type and price range
- Room details (capacity, price, amenities)
- Book now button (requires login)

### Booking System
- Date picker with validation
- Guest information form
- Automatic price calculation
- Email confirmation

### User Dashboard
- View all bookings
- Cancel bookings
- Update profile information

### Admin Dashboard
- Manage all rooms
- View all bookings
- User management
- Role-based access

## Security Features

- **Password Encryption**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **RBAC**: Role-based access control (Guest, User, Manager, Admin)
- **Environment Variables**: Sensitive data in .env
- **CORS**: Cross-Origin Resource Sharing enabled

## Email Notifications

The system sends automated emails for:
-  Welcome email on registration
-  Booking confirmation
-  Booking cancellation

Configure email service in `.env` file.

## Deployment

### Deploy to Render

1. Create account on [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure environment variables
5. Deploy

### Deploy to Railway

1. Create account on [Railway](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### Environment Variables for Deployment
Make sure to set all variables from `.env.example` in your deployment platform.

## User Roles

### Guest (Unauthenticated)
- Browse rooms
- View room details

### User (Authenticated)
- All guest permissions
- Create bookings
- View own bookings
- Cancel own bookings
- Update profile

### Admin
- All user permissions
- Create/update/delete rooms
- View all bookings
- Delete any booking
- Manage users
- Change user roles

## Testing

To test the application:

1. **Register a new user**
2. **Login with credentials**
3. **Browse rooms and create a booking**
4. **View bookings in the dashboard**
5. **Update your profile**

For admin features:
- Manually update a user's role to 'admin' in MongoDB
- Login as admin to access admin dashboard

## Validation Rules

### User Registration
- Username: minimum 3 characters
- Email: valid email format
- Password: minimum 6 characters

### Booking
- Check-in date: cannot be in the past
- Check-out date: must be after check-in
- Number of guests: must not exceed room capacity
- All guest information fields are required

### Room Creation (Admin)
- Room number: required, unique
- Type: must be one of predefined types
- Price: must be positive number
- Capacity: minimum 1

## Error Handling

The application includes:
- Global error handler middleware
- Mongoose validation errors
- Duplicate key errors
- Cast errors (invalid IDs)
- JWT errors
- Custom error messages

## Contributing

This is a final project for educational purposes.

## License

ISC License

## Author

Created as a final project for the course requirements.

## Support

For issues or questions, please contact through the course LMS.

## Important Notes

- Never commit `.env` file to Git
- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS in production
- Set up proper email service for production
- MongoDB Atlas free tier has limitations
- Keep dependencies updated

## Project Requirements Checklist

-  Node.js and Express backend
-  Modular structure (routes, models, controllers, middleware)
-  MongoDB Atlas database
-  Two collections (User, Booking, Room)
-  All required API endpoints
-  JWT authentication
-  Password hashing with bcrypt
-  Input validation
-  Error handling
-  Responsive frontend
-  Form validation
-  RBAC implementation
-  Email service integration
-  Environment variables
-  README with documentation
-  Screenshots
-  Deployment ready