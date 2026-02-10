const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

exports.sendBookingConfirmation = async (booking, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.guestEmail,
      subject: 'Booking Confirmation - Hotel Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Booking Confirmation</h2>
          <p>Dear ${booking.guestName},</p>
          <p>Your booking has been confirmed! Here are your booking details:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
            <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          
          ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          
          <p>We look forward to welcoming you!</p>
          <p>Best regards,<br>Hotel Management Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};

exports.sendBookingCancellation = async (booking) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.guestEmail,
      subject: 'Booking Cancellation - Hotel Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f44336;">Booking Cancelled</h2>
          <p>Dear ${booking.guestName},</p>
          <p>Your booking has been cancelled.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
          </div>
          
          <p>If you did not request this cancellation, please contact us immediately.</p>
          <p>Best regards,<br>Hotel Management Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking cancellation email sent successfully');
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

exports.sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Hotel Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to Hotel Management System!</h2>
          <p>Dear ${user.username},</p>
          <p>Thank you for registering with us. Your account has been created successfully.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse available rooms</li>
            <li>Make bookings</li>
            <li>Manage your reservations</li>
            <li>Update your profile</li>
          </ul>
          <p>We look forward to serving you!</p>
          <p>Best regards,<br>Hotel Management Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
