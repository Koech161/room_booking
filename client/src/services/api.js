import axios from 'axios';

const api = axios.create({
    baseURL:"http://127.0.0.1:5555",
});

// Set default headers
api.defaults.headers.common['Content-Type'] = 'application/json';
api.defaults.timeout = 10000; // Set a timeout

// Interceptor for handling errors globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            
        
            console.error('API Error:', error.response.data);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);


export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
