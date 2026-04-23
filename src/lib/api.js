const API = "http://localhost:5000/api";

// Helper to get auth token
const getToken = () => {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem("token") || "";
};

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Token expired - clear and redirect
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
  
  return res.json();
};

export const api = {
  // ==========================================
  // Auth APIs
  // ==========================================
  userSignup: async (data) => {
    const res = await fetch(`${API}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  userLogin: async (data) => {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  barberSignup: async (data) => {
    const res = await fetch(`${API}/studios/manage/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  createBarberSignupPaymentOrder: async (data) => {
    const res = await fetch(`${API}/studios/manage/signup/payment/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyBarberSignupPayment: async (data) => {
    const res = await fetch(`${API}/studios/manage/signup/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  barberLogin: async (data) => {
    const res = await fetch(`${API}/studios/manage/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  sendVerification: async (data) => {
    const res = await fetch(`${API}/verification/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyCode: async (data) => {
    const res = await fetch(`${API}/verification/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${API}/password/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  resetPassword: async (token, newPassword) => {
    const res = await fetch(`${API}/password/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });
    return res.json();
  },

  // ==========================================
  // Studio APIs
  // ==========================================
  getStudios: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/studios${query ? `?${query}` : ""}`);
  },

  getStudio: async (id) => {
    return authFetch(`${API}/studios/${id}`);
  },

  getStudioServices: async (id, category) => {
    const query = category ? `?category=${category}` : "";
    return authFetch(`${API}/studios/${id}/services${query}`);
  },

  getStudioBarbers: async (id) => {
    return authFetch(`${API}/studios/${id}/barbers`);
  },

  // ==========================================
  // Booking APIs
  // ==========================================
  getAvailability: async (studioId, barberId, date) => {
    const params = new URLSearchParams({ studioId, date });
    if (barberId) params.append("barberId", barberId);
    return authFetch(`${API}/bookings/availability?${params}`);
  },

  createBooking: async (data) => {
    return authFetch(`${API}/bookings`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/bookings${query ? `?${query}` : ""}`);
  },

  getBooking: async (id) => {
    return authFetch(`${API}/bookings/${id}`);
  },

  cancelBooking: async (id, reason) => {
    return authFetch(`${API}/bookings/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason })
    });
  },

  rescheduleBooking: async (id, data) => {
    return authFetch(`${API}/bookings/${id}/reschedule`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // Review APIs
  // ==========================================
  createReview: async (data) => {
    return authFetch(`${API}/reviews`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getStudioReviews: async (studioId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/studio/${studioId}${query ? `?${query}` : ""}`);
  },

  getBarberReviews: async (barberId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/barber/${barberId}${query ? `?${query}` : ""}`);
  },

  getMyReviews: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/me${query ? `?${query}` : ""}`);
  },

  markReviewHelpful: async (id) => {
    return authFetch(`${API}/reviews/${id}/helpful`, {
      method: "POST"
    });
  },

  // ==========================================
  // Profile APIs
  // ==========================================
  getProfile: async () => {
    return authFetch(`${API}/profile`);
  },

  updateProfile: async (data) => {
    return authFetch(`${API}/profile`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  updateNotifications: async (settings) => {
    return authFetch(`${API}/profile/notifications`, {
      method: "PUT",
      body: JSON.stringify(settings)
    });
  },

  deleteAccount: async (password) => {
    return authFetch(`${API}/profile`, {
      method: "DELETE",
      body: JSON.stringify({ password })
    });
  },

  getFavorites: async () => {
    return authFetch(`${API}/profile/favorites`);
  },

  addFavorite: async (studioId) => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "POST"
    });
  },

  removeFavorite: async (studioId) => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "DELETE"
    });
  },

  // ==========================================
  // Admin APIs
  // ==========================================
  adminLogin: async (data) => {
    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getDashboardStats: async () => {
    const res = await fetch(`${API}/admin/dashboard-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("adminToken") : ""}`
      }
    });
    return res.json();
  },

  getPendingBarbers: async () => {
    const res = await fetch(`${API}/admin/barbers/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("adminToken") : ""}`
      }
    });
    return res.json();
  },

  getAllBarbers: async () => {
    const res = await fetch(`${API}/admin/barbers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("adminToken") : ""}`
      }
    });
    return res.json();
  },

  approveBarber: async (barberId) => {
    const res = await fetch(`${API}/admin/barbers/${barberId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("adminToken") : ""}`
      }
    });
    return res.json();
  },

  rejectBarber: async (barberId, reason) => {
    const res = await fetch(`${API}/admin/barbers/${barberId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("adminToken") : ""}`
      },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  getBarberStatus: async () => {
    const res = await fetch(`${API}/barbers/me/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("barberToken") : ""}`
      }
    });
    return res.json();
  }
};
