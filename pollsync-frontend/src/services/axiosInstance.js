import axios from 'axios';
import { getToken } from '../utils/storage';

/*
|--------------------------------------------------------------------------
| Environment-Aware Backend URL
|--------------------------------------------------------------------------
|
| Development:
|   http://localhost:8000
|
| Production:
|   Uses Vercel environment variable
|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/*
|--------------------------------------------------------------------------
| Debug Logs
|--------------------------------------------------------------------------
|
| Remove later after deployment testing
|
*/

console.log('ENV MODE:', import.meta.env.MODE);
console.log('API BASE URL:', API_BASE_URL);

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Inject JWT Token
|--------------------------------------------------------------------------
*/

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
|--------------------------------------------------------------------------
| Global Response Error Handling
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url?.includes('/api/auth/me');
      const isLoginRoute = error.config?.url?.includes('/api/auth/login');
      
      // Only clear token and redirect if this is NOT 
      // the initial session restore call
      if (!isAuthCheck && !isLoginRoute) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      } else {
        // Silent fail — just clear the token
        // let the app handle the unauthenticated state
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;