import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Safely get username with fallback
    const getUsername = () => {
        if (user && typeof user === 'object' && user.username) {
            return user.username;
        }
        return 'User';
    };

    // Check if user is admin
    const isAdmin = user && user.admin === true;

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="header-title">Todo App</h1>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span className="user-name">
                            Welcome, {getUsername()}
                            {isAdmin && <span className="admin-badge">👑 Admin</span>}
                        </span>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 