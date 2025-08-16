import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Token storage keys
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

// Create axios instance with base configuration
const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
authAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication functions
export const login = async (username, password) => {
    try {
        const response = await authAxios.post('/login', { username, password });
        console.log('Login response:', response.data); // Debug log

        const { token } = response.data;

        // Validate response data
        if (!token) {
            return {
                success: false,
                error: 'No token received from server'
            };
        }

        // Store token and create minimal user data
        localStorage.setItem(TOKEN_KEY, token);
        const user = { username };
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        console.error('Login error:', error); // Debug log
        return {
            success: false,
            error: error.response?.data?.error || 'Login failed'
        };
    }
};

export const signup = async (username, password, admin = false) => {
    try {
        const response = await authAxios.post('/signup', { username, password, admin });
        console.log('Signup response:', response.data); // Debug log

        const { token } = response.data;

        // Validate response data
        if (!token) {
            return {
                success: false,
                error: 'No token received from server'
            };
        }

        // Store token and create minimal user data
        localStorage.setItem(TOKEN_KEY, token);
        const user = { username, admin };
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        console.error('Signup error:', error); // Debug log
        return {
            success: false,
            error: error.response?.data?.error || 'Signup failed'
        };
    }
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Getting token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    return token;
};

export const getUser = () => {
    try {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) {
            console.log('No user data found in localStorage');
            return null;
        }
        const user = JSON.parse(userStr);
        console.log('Retrieved user data:', user);
        return user;
    } catch (error) {
        console.error('Error parsing user data:', error);
        // If parsing fails, clear the corrupted data and return null
        localStorage.removeItem(USER_KEY);
        return null;
    }
};

export const isAuthenticated = () => {
    return !!getToken();
};

export default authAxios; 