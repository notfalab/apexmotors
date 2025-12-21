// ============================================================================
// API SERVICE - APEX MOTORS
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'https://apexmotors-backend-production.up.railway.app'

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const token = localStorage.getItem('apex-token')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API Error')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ============================================================================
// VEHICLES
// ============================================================================
export async function getVehicles(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/api/vehicles${query ? `?${query}` : ''}`)
}

export async function getVehicle(id) {
  return apiCall(`/api/vehicles/${id}`)
}

export async function checkAvailability(vehicleId, pickupDate, dropoffDate) {
  return apiCall(`/api/vehicles/${vehicleId}/check-availability?pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`)
}

// ============================================================================
// BOOKINGS
// ============================================================================
export async function createBooking(bookingData) {
  return apiCall('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  })
}

export async function confirmPayment(bookingId, paymentIntentId) {
  return apiCall(`/api/bookings/${bookingId}/confirm-payment`, {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId }),
  })
}

export async function getBooking(id) {
  return apiCall(`/api/bookings/${id}`)
}

// ============================================================================
// COUPONS
// ============================================================================
export async function validateCoupon(code, orderAmount) {
  return apiCall('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderAmount }),
  })
}

// ============================================================================
// AUTH
// ============================================================================
export async function login(email, password) {
  const data = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  if (data.token) {
    localStorage.setItem('apex-token', data.token)
  }
  
  return data
}

export async function register(userData) {
  const data = await apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  
  if (data.token) {
    localStorage.setItem('apex-token', data.token)
  }
  
  return data
}

export async function getMe() {
  return apiCall('/api/auth/me')
}

export function logout() {
  localStorage.removeItem('apex-token')
}

export function isLoggedIn() {
  return !!localStorage.getItem('apex-token')
}

// ============================================================================
// ADMIN - VEHICLES
// ============================================================================
export async function createVehicle(vehicleData) {
  return apiCall('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicleData),
  })
}

export async function updateVehicle(id, vehicleData) {
  return apiCall(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vehicleData),
  })
}

export async function deleteVehicle(id) {
  return apiCall(`/api/vehicles/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// ADMIN - BOOKINGS
// ============================================================================
export async function getAllBookings(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/api/bookings/admin/all${query ? `?${query}` : ''}`)
}

export async function updateBookingStatus(id, status) {
  return apiCall(`/api/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function getDashboardStats() {
  return apiCall('/api/bookings/admin/dashboard')
}

// ============================================================================
// ADMIN - COUPONS
// ============================================================================
export async function getCoupons() {
  return apiCall('/api/coupons')
}

export async function createCoupon(couponData) {
  return apiCall('/api/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData),
  })
}

export async function updateCoupon(id, couponData) {
  return apiCall(`/api/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(couponData),
  })
}

export async function deleteCoupon(id) {
  return apiCall(`/api/coupons/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// ADMIN - AUTH
// ============================================================================
export async function getAllUsers(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiCall(`/api/auth/users${query ? `?${query}` : ''}`)
}

// ============================================================================
// EXTRAS & LOCATIONS
// ============================================================================
export async function getExtras() {
  return apiCall('/api/extras')
}

export async function getLocations() {
  return apiCall('/api/locations')
}

export default {
  getVehicles,
  getVehicle,
  checkAvailability,
  createBooking,
  confirmPayment,
  validateCoupon,
  login,
  register,
  getMe,
  logout,
  isLoggedIn,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllUsers,
  getExtras,
  getLocations,
}
