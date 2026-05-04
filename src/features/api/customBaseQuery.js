import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../auth/authSlice';

// Helper to get fresh tokens directly from the API when we have a refresh token
const getNewAccessToken = async (refreshToken) => {
  const response = await fetch('http://localhost:9000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  
  if (!response.ok) {
    throw new Error('Refresh failed');
  }
  
  return await response.json();
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:9000/api',
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get an unauthorized error, we try to refresh the token
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = api.getState().auth.refreshToken;
    if (refreshToken) {
      try {
        const refreshResult = await getNewAccessToken(refreshToken);
        
        // store the new token
        api.dispatch({ type: 'auth/setCredentials', payload: refreshResult });
        
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } catch (err) {
        // If refresh fails, log the user out
        api.dispatch(logout());
      }
    } else {
        api.dispatch(logout());
    }
  }
  return result;
};
