import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { authApiSlice } from '../features/auth/authApiSlice';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const getUrlParameter = (name) => {
        name = name.replace(/\[/, '\\[').replace(/\]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const accessToken = getUrlParameter('accessToken');
    const refreshToken = getUrlParameter('refreshToken');

    // After setting tokens, we want to fetch the user details. 
    // RTK Query will use the access token we just dispatched.
    useEffect(() => {
        if (accessToken && refreshToken) {
            // First set tokens so the customBaseQuery uses them
            dispatch(setCredentials({ accessToken, refreshToken }));
            
            // Then fetch the user info
            dispatch(authApiSlice.endpoints.getMe.initiate())
                .unwrap()
                .then((user) => {
                    // Re-dispatch with the fetched user details
                    dispatch(setCredentials({ accessToken, refreshToken, user }));
                    navigate('/');
                })
                .catch((err) => {
                    console.error('Failed to fetch user details', err);
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [accessToken, refreshToken, dispatch, navigate]);

    return (
        <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                <svg className="spinner" viewBox="0 0 50 50" style={{ width: '40px', height: '40px', animation: 'rotate 2s linear infinite', color: 'var(--color-primary)', margin: '0 auto var(--space-4)' }}>
                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeDasharray="90, 150" style={{ animation: 'dash 1.5s ease-in-out infinite' }} />
                </svg>
                <h2 style={{ color: 'var(--color-text-main)' }}>Authenticating...</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Please wait while we log you in securely.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
