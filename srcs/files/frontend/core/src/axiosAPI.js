import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/users/',
    timeout: 0,
    headers: {
        'Authorization': "Baerer " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },

});

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

export const interceptor_response = axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.log('AXIOS INTERCEPTOR RESPONSE ', error.response.status)
      const originalRequest = error.config;
      
      if (error.response.status === 401) {
            console.log("Unauthorized access, token died")
			//! This is the place where we can refresh the token, now it's comment while ahcene is working on it
          /*const refresh_token = localStorage.getItem('refresh_token');
          return axiosInstance
              .post('/token/refresh/', {refresh: refresh_token})
              .then((response) => {

                  localStorage.setItem('access_token', response.data.access);
                  localStorage.setItem('refresh_token', response.data.refresh);

                  axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                  axiosInstance.defaults.headers.common['Authorization'] = "JWT " + response.data.access;
                  originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                  return axiosInstance(originalRequest);
              })
              .catch(err => {
                  console.log(err)
              });*/
      }
      else if (error.response.status === 403) {
        console.log("No credentials");
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
        return 
        // return Promise.reject(error);
      }
      else if (error.response.status === 404) {
        console.log("Post not found");
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
      }
      else if (error.response.status === 500) {
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
      }
      else if (error.response.status === 502) {
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
      }
      else if (error.response.status === 503) {
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
      }
      else if (error.response.status === 504) {
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
        console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
      }
      else
        {
            console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.status)
            console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data)
            console.log('AXIOS INTERCEPTOR ERROR RESPONSE : ', error.response.data.detail)
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