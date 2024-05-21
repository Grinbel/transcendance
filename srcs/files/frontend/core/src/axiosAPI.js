import axios from 'axios'
import { useNavigate } from 'react-router-dom';



export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/users/',
    timeout: 0,
    headers: {
        'Authorization': "Baerer " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },

});

let refreshing = false;

let refreshSubscribers = [];

const onRrefreshed = (token) => {
    // loop through all waiting requests and use the new token
    refreshSubscribers.forEach((callback) => callback(token));
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

export const interceptor_response = axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const navigate = useNavigate();
      const status = error.response ? error.response.status : null;
      console.log('AXIOS INTERCEPTOR ERROR ', error.response.status)
      const originalRequest = error.config;
      if (status)
        {

          if (status === 401 && refreshed === false) 
          {
            originalRequest._retry = true;
            
          // case token expired we will try refreshing it by sending once again a request to refresh endpoint
            if (!refreshing)
            {
              refreshing = true;
              return axiosInstance
                .post('/token/refresh/', {refresh: localStorage.getItem('refresh_token')})
                .then((response) => {
                  // if success we will update the tokens in the local storage and in the axios headers
                  if (response.status === 200)
                  {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                    originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                    onRrefreshed(response.data.access);
                    return axiosInstance(originalRequest);
                  }
                })
                .catch(err => {
                  // if the refresh token is expired we will redirect the user to the login page
                  console.log('redirected to login page: ', err)
                  navigate('/login');
                  return Promise.reject(err);
                })
                .finally(() => {
                  refreshing = false;
                });
            }

            const retryOriginalRequest = new Promise((resolve, reject) => {
              addRefreshSubscriber((token) => {
                  originalRequest.headers['Authorization'] = 'Bearer ' + token;
                  resolve(apiInstance(originalRequest));
              });
            });

            return retryOriginalRequest;
          }

          if (status === 401 && originalRequest._retry === true) {
            // if the refresh token is expired we will redirect the user to the login page
            console.log('REFRESH TOKEN EXPIRED: ')
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return Promise.reject(err);
          }
      }
      else 
      {
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE NULL : ', error.response.data.detail)
      }
      return Promise.reject(error);
    }
);

// AXIOS ERROR TYPES AND ERROR 
// https://github.com/axios/axios?tab=readme-ov-file#handling-errors

// Property 	Definition
// message 	A quick summary of the error message and the status it failed with.
// name 	This defines where the error originated from. For axios, it will always be an 'AxiosError'.
// stack 	Provides the stack trace of the error.
// config 	An axios config object with specific instance configurations defined by the user from when the request was made
// code 	Represents an axios identified error. The table below lists out specific definitions for internal axios error.
// status 	HTTP response status code. See here for common HTTP response status code meanings.


// export const interceptor_request = axiosInstance.interceptors.request.use(config => {
//     const authToken = localStorage.getItem('authToken');
//     if (authToken) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//       config.headers['Content-Type'] = 'application/json';
//       config.headers['accept'] = 'application/json';
//     }
//     else
//     {
//         console.log('AXIOS INTERCEPTOR REQUEST: NO AUTH TOKEN')
//     }
//     return config;
//   });