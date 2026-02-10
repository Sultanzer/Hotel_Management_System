const API_URL = '/api';

let currentUser = null;
let currentPage = 'home';
let rooms = [];
let bookings = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeAuth();
  setupEventListeners();
  handleRouting();
});

function initializeAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    currentUser = JSON.parse(user);
    updateUIForAuth();
  }
}

function updateUIForAuth() {
  const guestLinks = document.querySelectorAll('.guest-only');
  const authLinks = document.querySelectorAll('.auth-required');
  const adminLinks = document.querySelectorAll('.admin-only');

  if (currentUser) {
    guestLinks.forEach(link => (link.style.display = 'none'));
    authLinks.forEach(link => (link.style.display = 'block'));

    if (['admin', 'manager'].includes(currentUser.role)) {
      adminLinks.forEach(link => (link.style.display = 'block'));
    }

    const usersTabBtn = document.getElementById('adminUsersTabBtn');
    if (usersTabBtn) {
      usersTabBtn.style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';
    }
  } else {
    guestLinks.forEach(link => (link.style.display = 'block'));
    authLinks.forEach(link => (link.style.display = 'none'));
    adminLinks.forEach(link => (link.style.display = 'none'));
  }
}

function setupEventListeners() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
  document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
  document.getElementById('bookingForm')?.addEventListener('submit', handleBooking);
  document.getElementById('addRoomForm')?.addEventListener('submit', handleAddRoom);

  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

  document.getElementById('bookingCheckIn')?.addEventListener('change', calculateBookingPrice);
  document.getElementById('bookingCheckOut')?.addEventListener('change', calculateBookingPrice);
}

function handleNavigation(e) {
  e.preventDefault();
  const href = e.target.getAttribute('href');

  if (href && href.startsWith('#')) {
    const page = href.substring(1);
    navigateTo(page);
  }
}

function navigateTo(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${page}`) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = page;

    loadPageData(page);

    window.history.pushState({}, '', `#${page}`);
  }

  document.getElementById('navMenu')?.classList.remove('active');
}

function handleRouting() {
  const hash = window.location.hash.substring(1) || 'home';
  navigateTo(hash);
}

function loadPageData(page) {
  switch (page) {
    case 'rooms':
      loadRooms();
      break;
    case 'bookings':
      if (currentUser) loadMyBookings();
      break;
    case 'profile':
      if (currentUser) loadProfile();
      break;
    case 'admin':
      if (currentUser && ['admin', 'manager'].includes(currentUser.role)) {
        loadAdminData();
      }
      break;
  }
}

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('Non-JSON response from API:', { url, status: response.status, text });
    throw new Error('Server returned non-JSON (HTML). Check that /api routes exist and are not falling back to index.html.');
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    currentUser = data.data;

    showToast('Login successful!', 'success');
    updateUIForAuth();
    navigateTo('home');

    e.target.reset();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const phoneNumber = document.getElementById('regPhone').value;
    const adminCode = document.getElementById('regAdminCode')?.value;
    
    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                ...(adminCode ? { adminCode } : {})
            })
        });
        
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        currentUser = data.data;
        
        showToast('Registration successful!', 'success');
        updateUIForAuth();
        navigateTo('home');
        
        e.target.reset();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;

  showToast('Logged out successfully', 'success');
  updateUIForAuth();
  navigateTo('home');
}

async function loadProfile() {
  if (!currentUser) return;

  try {
    const data = await apiRequest('/users/profile');
    const user = data.data;

    document.getElementById('profileUsername').value = user.username || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileFirstName').value = user.firstName || '';
    document.getElementById('profileLastName').value = user.lastName || '';
    document.getElementById('profilePhone').value = user.phoneNumber || '';
    document.getElementById('profileRole').value = user.role || '';
  } catch (error) {
    showToast(`Failed to load profile: ${error.message}`, 'error');
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();

  const username = document.getElementById('profileUsername').value;
  const email = document.getElementById('profileEmail').value;
  const firstName = document.getElementById('profileFirstName').value;
  const lastName = document.getElementById('profileLastName').value;
  const phoneNumber = document.getElementById('profilePhone').value;

  try {
    const data = await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({
        username,
        email,
        firstName,
        lastName,
        phoneNumber
      })
    });

    currentUser = { ...currentUser, ...data.data };
    localStorage.setItem('user', JSON.stringify(currentUser));

    showToast('Profile updated successfully!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadRooms(filters = {}) {
  const container = document.getElementById('roomsContainer');
  container.innerHTML = '<div class="loading">Loading rooms...</div>';

  try {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

    const query = queryParams.toString();
    const data = await apiRequest(`/rooms${query ? '?' + query : ''}`);

    rooms = Array.isArray(data.data) ? data.data : [];
    displayRooms(rooms);

  } catch (error) {
    console.error('loadRooms error:', error);
    container.innerHTML = `<p>Failed to load rooms: ${error.message}</p>`;
    showToast(`Failed to load rooms: ${error.message}`, 'error');
  }
}

function displayRooms(roomsToDisplay) {
  const container = document.getElementById('roomsContainer');

  if (!roomsToDisplay || roomsToDisplay.length === 0) {
    container.innerHTML = '<p>No rooms found</p>';
    return;
  }

  container.innerHTML = roomsToDisplay
    .map(
      room => `
    <div class="room-card">
      <div class="room-card-header">
        <h3>Room ${room.roomNumber}</h3>
        <span class="room-type">${room.type}</span>
      </div>
      <div class="room-card-body">
        <div class="room-info">
          <p>🛏️ Capacity: ${room.capacity} guest${room.capacity > 1 ? 's' : ''}</p>
          <p>🏢 Floor: ${room.floor || 'N/A'}</p>
          ${room.description ? `<p>${room.description}</p>` : ''}
        </div>
        <div class="room-price">$${room.price}/night</div>
        ${
          currentUser
            ? `<button class="btn btn-primary btn-block" onclick="openBookingModal('${room._id}', ${room.price}, ${room.capacity})">
                 Book Now
               </button>`
            : `<button class="btn btn-secondary btn-block" onclick="navigateTo('login')">
                 Login to Book
               </button>`
        }
      </div>
    </div>
  `
    )
    .join('');
}

function applyFilters() {
  const filters = {
    type: document.getElementById('roomTypeFilter').value,
    minPrice: document.getElementById('minPriceFilter').value,
    maxPrice: document.getElementById('maxPriceFilter').value
  };

  loadRooms(filters);
}

function clearFilters() {
  document.getElementById('roomTypeFilter').value = '';
  document.getElementById('minPriceFilter').value = '';
  document.getElementById('maxPriceFilter').value = '';
  loadRooms();
}

let selectedRoomPrice = 0;
let selectedRoomCapacity = 1;

function openBookingModal(roomId, price, capacity) {
  if (!currentUser) {
    showToast('Please login to book a room', 'warning');
    navigateTo('login');
    return;
  }

  selectedRoomPrice = price;
  selectedRoomCapacity = capacity;

  document.getElementById('bookingRoomId').value = roomId;
  document.getElementById('bookingGuests').max = capacity;

  document.getElementById('bookingGuestName').value =
    `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username;
  document.getElementById('bookingGuestEmail').value = currentUser.email;
  document.getElementById('bookingGuestPhone').value = currentUser.phoneNumber || '';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bookingCheckIn').min = today;
  document.getElementById('bookingCheckOut').min = today;

  document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('active');
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingPriceInfo').innerHTML = '';
}

function calculateBookingPrice() {
  const checkIn = document.getElementById('bookingCheckIn').value;
  const checkOut = document.getElementById('bookingCheckOut').value;

  if (checkIn && checkOut) {
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (days > 0) {
      const total = days * selectedRoomPrice;
      document.getElementById('bookingPriceInfo').innerHTML = `
        <strong>Total: </strong> ${days} night${days > 1 ? 's' : ''} × $${selectedRoomPrice} = $${total}
      `;
    }
  }
}

async function handleBooking(e) {
  e.preventDefault();

  const bookingData = {
    room: document.getElementById('bookingRoomId').value,
    checkInDate: document.getElementById('bookingCheckIn').value,
    checkOutDate: document.getElementById('bookingCheckOut').value,
    numberOfGuests: parseInt(document.getElementById('bookingGuests').value, 10),
    guestName: document.getElementById('bookingGuestName').value,
    guestEmail: document.getElementById('bookingGuestEmail').value,
    guestPhone: document.getElementById('bookingGuestPhone').value,
    specialRequests: document.getElementById('bookingSpecialRequests').value
  };

  try {
    await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });

    showToast('Booking created successfully! Confirmation email sent.', 'success');
    closeBookingModal();
    navigateTo('bookings');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadMyBookings() {
  const container = document.getElementById('bookingsContainer');
  container.innerHTML = '<div class="loading">Loading bookings...</div>';

  try {
    const data = await apiRequest('/bookings');
    bookings = data.data;
    displayBookings(bookings);
  } catch (error) {
    container.innerHTML = `<p>Failed to load bookings: ${error.message}</p>`;
    showToast(`Failed to load bookings: ${error.message}`, 'error');
  }
}

function displayBookings(bookingsToDisplay) {
  const container = document.getElementById('bookingsContainer');

  if (!bookingsToDisplay || bookingsToDisplay.length === 0) {
    container.innerHTML = '<p>No bookings found</p>';
    return;
  }

  container.innerHTML = bookingsToDisplay
    .map(
      booking => `
    <div class="booking-card">
      <div class="booking-header">
        <h3>Room ${booking.room?.roomNumber || 'N/A'} - ${booking.room?.type || ''}</h3>
        <span class="booking-status ${booking.status}">${booking.status}</span>
      </div>
      <div class="booking-details">
        <div>
          <strong>Check-in:</strong><br>
          ${new Date(booking.checkInDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Check-out:</strong><br>
          ${new Date(booking.checkOutDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Guests:</strong><br>
          ${booking.numberOfGuests}
        </div>
        <div>
          <strong>Total Price:</strong><br>
          $${booking.totalPrice}
        </div>
      </div>
      ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
      <div class="booking-actions">
        ${booking.status === 'pending' || booking.status === 'confirmed'
          ? `<button class="btn btn-danger" onclick="cancelBooking('${booking._id}')">Cancel Booking</button>`
          : ''}
      </div>
    </div>
  `
    )
    .join('');
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });

    showToast('Booking cancelled successfully', 'success');
    loadMyBookings();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadAdminData() {
  showAdminTab('rooms');
}

function showAdminTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event?.target?.classList.add('active') ||
    document.querySelector(`[onclick="showAdminTab('${tab}')"]`)?.classList.add('active');

  document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

  switch (tab) {
    case 'rooms':
      loadAdminRooms();
      break;
    case 'bookings':
      loadAdminBookings();
      break;
    case 'users':
      if (currentUser?.role === 'admin') {
        loadAdminUsers();
      } else {
        showToast('You are not authorized to manage users', 'error');
        showAdminTab('rooms');
      }
      break;
  }
}

async function loadAdminRooms() {
  const container = document.getElementById('adminRoomsContainer');
  container.innerHTML = '<div class="loading">Loading rooms...</div>';

  try {
    const data = await apiRequest('/rooms');

    container.innerHTML = `
      <div class="admin-table">
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.data
              .map(
                room => `
              <tr>
                <td>${room.roomNumber}</td>
                <td>${room.type}</td>
                <td>$${room.price}</td>
                <td>${room.capacity}</td>
                <td>${room.isAvailable ? '✅' : '❌'}</td>
                <td>
                  <button class="btn btn-danger" onclick="deleteRoom('${room._id}')">Delete</button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p>Failed to load rooms: ${error.message}</p>`;
  }
}

async function loadAdminBookings() {
  const container = document.getElementById('adminBookingsContainer');
  container.innerHTML = '<div class="loading">Loading bookings...</div>';

  try {
    const data = await apiRequest('/bookings/all/bookings');

    container.innerHTML = `
      <div class="admin-table">
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.data
              .map(
                booking => `
              <tr>
                <td>${booking.guestName}</td>
                <td>${booking.room?.roomNumber || 'N/A'}</td>
                <td>${new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>$${booking.totalPrice}</td>
                <td><span class="booking-status ${booking.status}">${booking.status}</span></td>
                <td>
                  <button class="btn btn-danger" onclick="deleteBooking('${booking._id}')">Delete</button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p>Failed to load bookings: ${error.message}</p>`;
  }
}

async function loadAdminUsers() {
  const container = document.getElementById('adminUsersContainer');
  container.innerHTML = '<div class="loading">Loading users...</div>';

  try {
    const data = await apiRequest('/users');

    container.innerHTML = `
      <div class="admin-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.data
              .map(
                user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  ${user._id !== currentUser.id
                    ? `<button class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>`
                    : '<em>Current user</em>'}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p>Failed to load users: ${error.message}</p>`;
  }
}

function showAddRoomModal() {
  document.getElementById('addRoomModal').classList.add('active');
}

function closeAddRoomModal() {
  document.getElementById('addRoomModal').classList.remove('active');
  document.getElementById('addRoomForm').reset();
}

async function handleAddRoom(e) {
  e.preventDefault();

  const roomData = {
    roomNumber: document.getElementById('roomNumber').value,
    type: document.getElementById('roomType').value,
    price: parseFloat(document.getElementById('roomPrice').value),
    capacity: parseInt(document.getElementById('roomCapacity').value, 10),
    description: document.getElementById('roomDescription').value,
    floor: parseInt(document.getElementById('roomFloor').value, 10) || 1
  };

  try {
    await apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });

    showToast('Room added successfully!', 'success');
    closeAddRoomModal();
    loadAdminRooms();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteRoom(roomId) {
  if (!confirm('Are you sure you want to delete this room?')) return;

  try {
    await apiRequest(`/rooms/${roomId}`, {
      method: 'DELETE'
    });

    showToast('Room deleted successfully', 'success');
    loadAdminRooms();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteBooking(bookingId) {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  try {
    await apiRequest(`/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    showToast('Booking deleted successfully', 'success');
    loadAdminBookings();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    await apiRequest(`/users/${userId}`, {
      method: 'DELETE'
    });

    showToast('User deleted successfully', 'success');
    loadAdminUsers();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}
