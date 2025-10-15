import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        } else {
            // Default to CUSTOMER for demo
            const mockUser = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                role: 'CUSTOMER', // Change this to 'ADMIN' to test admin panel
                token: 'mock-token-123'
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mockUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.reload(); // ✅ Fixed - just reload
    };

    // ✅ NEW FUNCTION - Switch role for testing
    const switchRole = () => {
        const newRole = user?.role === 'CUSTOMER' ? 'ADMIN' : 'CUSTOMER';
        const newUser = { ...user, role: newRole };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        window.location.reload(); // Reload to apply changes
    };

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const isCustomer = () => {
        return user?.role === 'CUSTOMER';
    };

    const getUserId = () => {
        return user?.id;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        switchRole, // ✅ NEW - For testing
        isAdmin,
        isCustomer,
        getUserId
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};