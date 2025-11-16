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
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      // If it's a network error or parsing error, provide better message
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please ensure the backend is running.');
      }
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

  async getUserListings(username) {
    return this.request(`/listings/user/${username}`);
  }

  // Votes
  async upvoteListing(listingId) {
    return this.request('/votes/upvote', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async downvoteListing(listingId) {
    return this.request('/votes/downvote', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeVote(listingId) {
    return this.request('/votes', {
      method: 'DELETE',
      body: JSON.stringify({ listingId }),
    });
  }

  async getVoteStatus(listingId) {
    return this.request(`/votes/${listingId}/status`);
  }

  async getVoteStats(listingId) {
    return this.request(`/votes/${listingId}/stats`);
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    // Don't set Content-Type - let browser set it with boundary

    try {
      const response = await fetch(`${this.baseURL}/listings/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async uploadImages(files) {
    const uploadedUrls = [];
    const allPromises = [];
    for (const file of files) {
      allPromises.push(this.uploadImage(file));
    }
    const results = await Promise.all(allPromises);
    for (const result of results) {
      uploadedUrls.push(result.url);
    }
    return uploadedUrls;
  }


  async getMyUpvotedListings() {
    return this.request('/votes/my-upvotes');
  }

  // Collections
  async getCollections() {
    return this.request('/collections');
  }

  async getUserCollections(username) {
    return this.request(`/collections/user/${username}`);
  }

  async getCollection(id) {
    return this.request(`/collections/${id}`);
  }

  async getCollectionsForListing(listingId) {
    return this.request(`/collections/for-listing/${listingId}`);
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

  async likeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  async unlikeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, {
      method: 'DELETE',
    });
  }

  async checkCommentLiked(commentId) {
    return this.request(`/comments/${commentId}/liked`);
  }

  async createReply(commentId, content) {
    return this.request(`/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getCommentReplies(commentId) {
    return this.request(`/comments/${commentId}/replies`);
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

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/users/upload-profile-picture`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    }
  }

  // Messages
  async getConversations() {
    return this.request('/messages');
  }

  async getOrCreateConversation(otherUserId) {
    return this.request('/messages/conversation', {
      method: 'POST',
      body: JSON.stringify({ otherUserId }),
    });
  }

  async getConversation(conversationId) {
    return this.request(`/messages/conversation/${conversationId}`);
  }

  async sendMessage(conversationId, content) {
    return this.request(`/messages/conversation/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markConversationRead(conversationId) {
    return this.request(`/messages/conversation/${conversationId}/read`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
