import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://0.0.0.0:8000/users/',
    timeout: 5000,
    headers: {
        'Authorization': "JWT  " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.log('AXIOS INTERCEPTOR error RESPONSE')
      const originalRequest = error.config;
      
      if (error.status === 401) {
          const refresh_token = localStorage.getItem('refresh_token');

          return axiosInstance
              .post('/token/refresh/', {refresh: refresh_token})
              .then((response) => {

                  localStorage.setItem('access_token', response.data.access);
                  localStorage.setItem('refresh_token', response.data.refresh);

                  axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                  originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                  return axiosInstance(originalRequest);
              })
              .catch(err => {
                  console.log(err)
              });
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