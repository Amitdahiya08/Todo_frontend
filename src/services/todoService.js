import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080/api/todos';

// Create axios instance with authentication
const todoAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
todoAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        console.log('Todo request config:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No JWT token found for todo request');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Handle token expiration and other errors
todoAxios.interceptors.response.use(
    (response) => {
        console.log('Todo response success:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Todo response error:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });

        if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('Token expired, logging out user');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        } else if (error.response?.status === 404) {
            // Todo not found or not authorized (masked as 404)
            console.error('Todo not found or access denied');
        } else if (error.response?.status === 403) {
            // Forbidden (should be masked as 404 by backend)
            console.error('Access denied');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - backend might be down or CORS issue');
        }
        return Promise.reject(error);
    }
);

export const getTodos = () => {
    console.log('Fetching todos...');
    return todoAxios.get('');
};

export const getTodoById = (id) => {
    console.log('Fetching todo by ID:', id);
    return todoAxios.get(`/${id}`);
};

export const addTodo = (todo) => {
    console.log('Adding todo:', todo);
    return todoAxios.post('', todo);
};

export const updateTodo = (id, todo) => {
    console.log('Updating todo:', id, todo);
    return todoAxios.put(`/${id}`, todo);
};

export const deleteTodo = (id) => {
    console.log('Deleting todo:', id);
    return todoAxios.delete(`/${id}`);
};
