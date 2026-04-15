import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="header-brand">
          Aura
        </Link>
        <button className="mobile-toggle" aria-label="Toggle navigation">
          ☰
        </button>
        <ul className="header-nav" role="navigation">
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/addproduct" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Add Product
            </NavLink>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }} 
              className="nav-link"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
