
import apiClient from './apiService';


export const authService = {


    /**
   * Register a new user
   * POST /api/auth/register
   * @param {Object} userData - { firstName, lastName, email, password }
   * @returns {Promise} Response with user data and tokens
   */

    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },


    /**
   * Login with email and password
   * POST /api/auth/login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response with tokens
   */
    login: async (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

  /**
   * Logout user
   * POST /api/auth/logout?refreshToken=xxx
   * @param {string} refreshToken - Refresh token to invalidate
   * @returns {Promise} Response
   */
  logout: async (refreshToken) => {
    return apiClient.post('/auth/logout', null, {
      params: { refreshToken }
    });
  },

  /**
   * Get current logged-in user info
   * GET /api/auth/me
   * @returns {Promise} Response with user data
   */
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  }



}