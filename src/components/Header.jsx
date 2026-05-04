import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Google OAuth provides imageUrl or picture field
  const avatarUrl = user?.imageUrl || user?.picture || user?.profilePicture;

  return (
    <header className="app-header">
      <div className="container header-content">

        {/* Brand */}
        <Link to="/" className="header-brand">
          <span className="brand-dot" />
          Aura
        </Link>

        {/* Nav */}
        <ul className="header-nav" role="navigation">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/addproduct" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Add Product
            </NavLink>
          </li>

          {user && (
            <li className="user-menu-item" ref={dropdownRef}>
              <button
                id="user-avatar-btn"
                className={`user-pill ${dropdownOpen ? 'user-pill--open' : ''}`}
                onClick={() => setDropdownOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar: Google photo or initials fallback */}
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="user-avatar user-avatar--photo"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="user-avatar user-avatar--initials">
                    {getInitials(user.name)}
                  </span>
                )}
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <svg
                  className={`chevron-icon ${dropdownOpen ? 'chevron-icon--up' : ''}`}
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="user-dropdown page-transition" role="menu">
                  {/* User Info Header */}
                  <div className="dropdown-user-info">
                    {avatarUrl && !imgError ? (
                      <img
                        src={avatarUrl}
                        alt={user.name}
                        className="dropdown-avatar"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span className="dropdown-avatar dropdown-avatar--initials">
                        {getInitials(user.name)}
                      </span>
                    )}
                    <div>
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    id="logout-btn"
                    className="dropdown-item dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
