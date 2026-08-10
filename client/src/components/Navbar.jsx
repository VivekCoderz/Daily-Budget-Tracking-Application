import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { Wallet, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <Wallet size={20} />
          </span>
          <span className="logo-text">SpendWise</span>
        </Link>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="nav-user-badge">
                <UserIcon size={14} />
                <span className="user-name">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              </div>

              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard" className="btn btn-secondary nav-btn">
                  <LayoutDashboard size={16} />
                  <span className="btn-text">Dashboard</span>
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-secondary nav-btn logout-btn">
                <LogOut size={16} />
                <span className="btn-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary nav-btn">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary nav-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
