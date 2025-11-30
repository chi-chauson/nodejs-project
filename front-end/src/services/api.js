// API Base URL - update this if your backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        // Handle error responses
        throw new Error(data.error?.message || 'Something went wrong');
    }

    return data;
};

// Helper function to make authenticated requests
const fetchWithAuth = (url, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

// ==================== AUTH API ====================

export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    // Login
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await handleResponse(response);

        // Store token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }

        return data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!getAuthToken();
    },
};

// ==================== USER API ====================

export const userAPI = {
    // Get current user profile
    getMe: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/me`);
        return handleResponse(response);
    },

    // Update current user profile
    updateMe: async (updates) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        const data = await handleResponse(response);

        // Update stored user data
        if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }

        return data;
    },

    // Get user by ID
    getById: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        return handleResponse(response);
    },
};

// ==================== PLAYLIST API ====================

export const playlistAPI = {
    // Get all playlists (with filters)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.playlistName) params.append('playlistName', filters.playlistName);
        if (filters.userName) params.append('userName', filters.userName);
        if (filters.songTitle) params.append('songTitle', filters.songTitle);
        if (filters.songArtist) params.append('songArtist', filters.songArtist);
        if (filters.songYear) params.append('songYear', filters.songYear);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const queryString = params.toString();
        const url = queryString
            ? `${API_BASE_URL}/playlists?${queryString}`
            : `${API_BASE_URL}/playlists`;

        const response = await fetchWithAuth(url);
        return handleResponse(response);
    },

    // Get playlist by ID
    getById: async (playlistId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}`);
        return handleResponse(response);
    },

    // Create new playlist
    create: async (playlistData) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists`, {
            method: 'POST',
            body: JSON.stringify(playlistData),
        });
        return handleResponse(response);
    },

    // Update playlist
    update: async (playlistId, updates) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return handleResponse(response);
    },

    // Delete playlist
    delete: async (playlistId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Add song to playlist
    addSong: async (playlistId, songId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
            method: 'POST',
            body: JSON.stringify({ songId }),
        });
        return handleResponse(response);
    },

    // Remove song from playlist
    removeSong: async (playlistId, songId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Reorder songs in playlist
    reorderSongs: async (playlistId, songIds) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}/songs/reorder`, {
            method: 'PUT',
            body: JSON.stringify({ songIds }),
        });
        return handleResponse(response);
    },

    // Record playlist play
    recordPlay: async (playlistId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/playlists/${playlistId}/play`, {
            method: 'POST',
        });
        return handleResponse(response);
    },
};

// ==================== SONG API ====================

export const songAPI = {
    // Get all songs (with filters)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.title) params.append('title', filters.title);
        if (filters.artist) params.append('artist', filters.artist);
        if (filters.year) params.append('year', filters.year);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const queryString = params.toString();
        const url = queryString
            ? `${API_BASE_URL}/songs?${queryString}`
            : `${API_BASE_URL}/songs`;

        const response = await fetchWithAuth(url);
        return handleResponse(response);
    },

    // Get song by ID
    getById: async (songId) => {
        const response = await fetch(`${API_BASE_URL}/songs/${songId}`);
        return handleResponse(response);
    },

    // Create new song
    create: async (songData) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/songs`, {
            method: 'POST',
            body: JSON.stringify(songData),
        });
        return handleResponse(response);
    },

    // Update song
    update: async (songId, updates) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/songs/${songId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return handleResponse(response);
    },

    // Delete song
    delete: async (songId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/songs/${songId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Record song listen
    recordListen: async (songId) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/songs/${songId}/listen`, {
            method: 'POST',
        });
        return handleResponse(response);
    },
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
    check: async () => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return handleResponse(response);
    },
};