import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export const loginInstance = axios.create({
    baseURL: `http://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'        
    },  
});

export const axiosInstance = axios.create({
	 
    baseURL: `http://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/`,
	// baseURL: 'http://localhost:8000/users/',
    timeout: 0,
    headers: {
        'Authorization': "Baerer " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },

});

const refreshInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/`,
  timeout: 0,
  headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
  },
});


let refreshing = false;
let subscribers = [];

const onTokenRefreshed = (token) => {
  subscribers.map((callback) => callback(token));
  subscribers = [];
};

const addRefreshSubscriber = (callback) => {
  subscribers.push(callback);
};


export const interceptor_response = axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    console.log('interceptor_response: error status and retry', status, originalRequest._retry);
    if (status === 401 && !originalRequest._retry) {
      console.log('interceptor_response: 401 and not retried yet. refreshing ?', refreshing);
      if (!refreshing) {
        console.log('interceptor_response: refreshing token');
        refreshing = true;
        originalRequest._retry = true;

        return (refreshInstance
          .post('/token/refresh/', { refresh: localStorage.getItem('refresh_token') })
          .then((response) => {
            if (response.status === 200) {
              console.log('interceptor_response: token refreshed');
              localStorage.setItem('access_token', response.data.access);
              localStorage.setItem('refresh_token', response.data.refresh);
              axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
              originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

              onTokenRefreshed(response.data.access);
              return axiosInstance(originalRequest);
            }
          })
          .catch((err) => {
            console.log('Refresh token is expired, user needs to login again:', err.response.status);
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(err);
          })
          .finally(() => {
            console.log('interceptor_response: refreshing done in finally');
            refreshing = false;
          }));
      }

      const retryOriginalRequest = new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers['Authorization'] = 'JWT ' + token;
          resolve(axiosInstance(originalRequest));
        });
      });
      console.log('interceptor_response: retryOriginalRequest', retryOriginalRequest);
      return retryOriginalRequest;
    }

    if (status === 401 && originalRequest._retry) {
      console.log('Refresh token expired. Redirecting to login.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      return Promise.reject(error);
    }

    if (!status) {
      console.log('Network or server error, no response:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
