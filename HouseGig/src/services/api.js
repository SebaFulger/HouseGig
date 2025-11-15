const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(email, password, username) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Listings
  async getListings(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/listings?${params}`);
  }

  async getListing(id) {
    return this.request(`/listings/${id}`);
  }

  async createListing(listingData) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id, listingData) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyListings() {
    return this.request('/listings/my-listings');
  }

  // Likes
  async likeListing(listingId) {
    return this.request('/likes', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async unlikeListing(listingId) {
    return this.request('/likes', {
      method: 'DELETE',
      body: JSON.stringify({ listingId }),
    });
  }

  async getLikesCount(listingId) {
    return this.request(`/likes/${listingId}/count`);
  }

  async checkIfLiked(listingId) {
    return this.request(`/likes/${listingId}/check`);
  }

  async getMyLikedListings() {
    return this.request('/likes/my-likes');
  }

  // Collections
  async getCollections() {
    return this.request('/collections');
  }

  async getCollection(id) {
    return this.request(`/collections/${id}`);
  }

  async createCollection(collectionData) {
    return this.request('/collections', {
      method: 'POST',
      body: JSON.stringify(collectionData),
    });
  }

  async updateCollection(id, collectionData) {
    return this.request(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(collectionData),
    });
  }

  async deleteCollection(id) {
    return this.request(`/collections/${id}`, {
      method: 'DELETE',
    });
  }

  async addListingToCollection(collectionId, listingId) {
    return this.request(`/collections/${collectionId}/listings`, {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeListingFromCollection(collectionId, listingId) {
    return this.request(`/collections/${collectionId}/listings`, {
      method: 'DELETE',
      body: JSON.stringify({ listingId }),
    });
  }

  // Comments
  async getComments(listingId) {
    return this.request(`/comments/${listingId}`);
  }

  async createComment(listingId, content) {
    return this.request(`/comments/${listingId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updateComment(commentId, content) {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getMe() {
    return this.request('/users/me');
  }

  async getUserProfile(username) {
    return this.request(`/users/${username}`);
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

export const api = new ApiClient();
