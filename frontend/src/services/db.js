// ============================================================================
// FULL-STACK MONGOOSE/EXPRESS INTEGRATION CLIENT SERVICE
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to inject JWT token into requests
const getHeaders = (options = {}) => {
  const token = localStorage.getItem('iedc_token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// General API request wrapper
const apiRequest = async (path, options = {}) => {
  const headers = getHeaders(options);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

export const database = {
  // --- IMAGE UPLOAD ---
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const data = await apiRequest('/upload', {
      method: 'POST',
      body: formData
    });
    return data.url;
  },

  // --- STATS ---
  getStats: async () => {
    return apiRequest('/stats');
  },
  
  saveStats: async (stats) => {
    return apiRequest('/stats', {
      method: 'POST',
      body: JSON.stringify(stats)
    });
  },

  // --- ACHIEVEMENTS ---
  getAchievements: async () => {
    return apiRequest('/achievements');
  },

  saveAchievement: async (ach) => {
    return apiRequest('/achievements', {
      method: 'POST',
      body: JSON.stringify(ach)
    });
  },

  deleteAchievement: async (id) => {
    return apiRequest(`/achievements/${id}`, {
      method: 'DELETE'
    });
  },

  // --- EVENTS ---
  getEvents: async () => {
    return apiRequest('/events');
  },

  saveEvent: async (event) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  },

  deleteEvent: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  // --- TEAM ---
  getTeam: async () => {
    return apiRequest('/team');
  },

  saveTeamMember: async (member) => {
    return apiRequest('/team', {
      method: 'POST',
      body: JSON.stringify(member)
    });
  },

  deleteTeamMember: async (id) => {
    return apiRequest(`/team/${id}`, {
      method: 'DELETE'
    });
  },

  // --- GALLERY ---
  getGallery: async () => {
    return apiRequest('/gallery');
  },

  saveGalleryItem: async (item) => {
    return apiRequest('/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  deleteGalleryItem: async (id) => {
    return apiRequest(`/gallery/${id}`, {
      method: 'DELETE'
    });
  },

  // --- ALUMNI ---
  getAlumni: async () => {
    return apiRequest('/alumni');
  },

  saveAlumni: async (al) => {
    return apiRequest('/alumni', {
      method: 'POST',
      body: JSON.stringify(al)
    });
  },

  deleteAlumni: async (id) => {
    return apiRequest(`/alumni/${id}`, {
      method: 'DELETE'
    });
  },

  // --- GENERAL SETTINGS ---
  getGeneralSettings: async () => {
    return apiRequest('/settings');
  },

  saveGeneralSettings: async (settings) => {
    return apiRequest('/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  },

  // --- SUBMISSIONS (Contact form messages) ---
  getSubmissions: async () => {
    return apiRequest('/submissions');
  },

  addSubmission: async (sub) => {
    return apiRequest('/submissions', {
      method: 'POST',
      body: JSON.stringify(sub)
    });
  },

  markSubmissionRead: async (id, isRead = true) => {
    return apiRequest(`/submissions/${id}/read`, {
      method: 'PUT',
      body: JSON.stringify({ isRead })
    });
  },

  deleteSubmission: async (id) => {
    return apiRequest(`/submissions/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================================================
// AUTHENTICATION CLIENT INTERFACE
// ============================================================================

let authListeners = [];

export const authService = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store credentials locally
    localStorage.setItem('iedc_token', data.token);
    localStorage.setItem('iedc_user', JSON.stringify(data.user));
    
    // Broadcast logged-in state to active listeners
    authListeners.forEach(callback => callback(data.user));
    return data.user;
  },

  logout: async () => {
    localStorage.removeItem('iedc_token');
    localStorage.removeItem('iedc_user');
    
    // Broadcast logged-out state
    authListeners.forEach(callback => callback(null));
  },

  onStateChanged: (callback) => {
    // Invoke immediately with initial status
    const userStr = localStorage.getItem('iedc_user');
    const user = userStr ? JSON.parse(userStr) : null;
    callback(user);
    
    // Register listener
    authListeners.push(callback);
    
    // Return cleanup/unsubscribe routine
    return () => {
      authListeners = authListeners.filter(cb => cb !== callback);
    };
  }
};
