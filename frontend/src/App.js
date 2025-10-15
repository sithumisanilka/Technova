import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavigationBar from './components/common/NavigationBar';
import ServiceBookingForm from './components/ServiceBookingForm/ServiceBookingForm';
import CustomerDashboard from './components/CustomerDashboard/CustomerDashboard';
import CalendarInterface from './components/CalendarInterface/CalendarInterface';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ServiceDashboard from './components/ServiceDashboard/ServiceDashboard';
import './App.css';

function AppContent() {
    const { isAdmin, isCustomer } = useAuth();
    const [activeTab, setActiveTab] = useState(isAdmin() ? 'appointments' : 'booking');

    const renderContent = () => {
        // ✅ ADMIN ONLY - Full access
        if (isAdmin()) {
            switch (activeTab) {
                case 'appointments':
                    return <AdminPanel />;
                case 'services':
                    return <ServiceDashboard />;
                case 'calendar':
                    return <CalendarInterface role="ADMIN" />;
                default:
                    return <AdminPanel />;
            }
        } 
        // ✅ CUSTOMER - Limited access
        else if (isCustomer()) {
            switch (activeTab) {
                case 'booking':
                    return <ServiceBookingForm />;
                case 'myBookings':
                    return <CustomerDashboard />;
                case 'calendar':
                    return <CalendarInterface role="CUSTOMER" />;
                default:
                    return <ServiceBookingForm />;
            }
        }
        
        // ✅ Unauthorized access
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>⛔ Access Denied</h4>
                    <p>You don't have permission to access this page.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

