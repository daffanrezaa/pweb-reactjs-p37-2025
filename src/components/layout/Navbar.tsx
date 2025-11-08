import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/>
          </svg>
          <span>IT Literature Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Books
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/history" 
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            >
              History
            </Link>
          )}
        </div>

        {/* User Section - UPDATED ORDER */}
        <div className="navbar-user desktop">
          {isAuthenticated ? (
            <>
              {/* Shopping Cart - Moved before user info */}
              <Link 
                to="/checkout" 
                className={`nav-link ${isActive('/checkout') ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                  <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Shopping Cart</span>
              </Link>

              {/* User Info */}
              <div className="user-info">
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-email">{user?.email}</span>
              </div>

              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button secondary">
                Sign In
              </Link>
              <Link to="/register" className="nav-button primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-email">{user?.email}</span>
              </div>
              
              <div className="mobile-nav-links">
                <Link 
                  to="/" 
                  className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Books
                </Link>
                <Link 
                  to="/checkout" 
                  className={`mobile-nav-link ${isActive('/checkout') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                      <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Shopping Cart
                  </span>
                </Link>
                <Link 
                  to="/history" 
                  className={`mobile-nav-link ${isActive('/history') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  History
                </Link>
              </div>

              <button onClick={handleLogout} className="mobile-logout-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="mobile-button secondary" onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link to="/register" className="mobile-button primary" onClick={closeMobileMenu}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;