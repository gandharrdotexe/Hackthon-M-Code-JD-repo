const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Request failed',
          data,
        };
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        this.clearToken();
      }
      throw error;
    }
  }

  // Auth endpoints
  async anonymousLogin(deviceUuid) {
    const data = await this.request('/auth/anonymous', {
      method: 'POST',
      body: JSON.stringify({ deviceUuid }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async upgradeAccount(email, password) {
    const data = await this.request('/auth/upgrade', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  // User endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getDailyStatus() {
    return this.request('/user/daily-status');
  }

  // Log endpoints
  async logSugar(logData) {
    return this.request('/logs/sugar', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getHistory(limit = 20) {
    return this.request(`/logs/history?limit=${limit}`);
  }

  async completeAction(logId) {
    return this.request('/logs/action-complete', {
      method: 'POST',
      body: JSON.stringify({ logId }),
    });
  }

  // Health endpoint
  async syncHealth(healthData) {
    return this.request('/health/sync', {
      method: 'POST',
      body: JSON.stringify(healthData),
    });
  }

  // System
  async healthCheck() {
    return this.request('/healthz');
  }
}

export const api = new ApiClient();

// Error message mapper
export function getErrorMessage(error) {
  if (!error.status) {
    return 'Network error. Please check your connection.';
  }

  switch (error.status) {
    case 400:
    case 422:
      return error.message || 'Some details are invalid. Please check and try again.';
    case 401:
      return 'Session expired. Please tap to restart.';
    case 500:
      return 'Something went wrong on our side. Please try again in a moment.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}