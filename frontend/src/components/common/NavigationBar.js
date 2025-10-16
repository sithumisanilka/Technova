import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './NavigationBar.css';

const NavigationBar = ({ activeTab, setActiveTab }) => {
    const { user, isAdmin, logout, switchRole } = useAuth(); // ✅ Add switchRole

    const customerTabs = [
        { id: 'booking', label: 'Book Service', icon: '📅' },
        { id: 'myBookings', label: 'My Bookings', icon: '📋' },
        { id: 'calendar', label: 'Calendar', icon: '🗓️' }
    ];

    const adminTabs = [
        { id: 'appointments', label: 'Manage Bookings', icon: '📊' },
        { id: 'services', label: 'Manage Services', icon: '⚙️' },
        { id: 'calendar', label: 'Calendar', icon: '🗓️' }
    ];

    const tabs = isAdmin() ? adminTabs : customerTabs;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <span className="navbar-brand">🏢 Service Booking System</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button 
                                    className={`nav-link btn btn-link ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3">
                            👤 {user?.name || 'User'} 
                            <span className={`badge ms-2 ${isAdmin() ? 'bg-danger' : 'bg-light text-dark'}`}>
                                {user?.role || 'CUSTOMER'}
                            </span>
                        </span>
                        
                        {/* ✅ NEW - Switch Role Button (FOR TESTING ONLY) */}
                        <button 
                            className="btn btn-warning btn-sm me-2" 
                            onClick={switchRole}
                            title="Switch between Customer and Admin (Testing Only)"
                        >
                            🔄 Switch to {isAdmin() ? 'Customer' : 'Admin'}
                        </button>
                        
                        <button className="btn btn-outline-light btn-sm" onClick={logout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;