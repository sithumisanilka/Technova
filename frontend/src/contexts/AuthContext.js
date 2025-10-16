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
            // Default Customer user
            const mockCustomer = {
                id: 1,
                name: 'User',  // ✅ Customer name
                email: 'john@example.com',
                phone: '1234567890',
                role: 'CUSTOMER',
                token: 'mock-token-123'
            };
            setUser(mockCustomer);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mockCustomer));
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
        window.location.reload();
    };

    const switchRole = () => {
        // Switch between Customer and Admin
        const newUser = user?.role === 'CUSTOMER' 
            ? { 
                id: 2, 
                name: 'Mr. Neel',  // ✅ Admin name
                email: 'neel@admin.com', 
                phone: '0987654321', 
                role: 'ADMIN', 
                token: 'mock-token-456' 
            }
            : { 
                id: 1, 
                name: 'User',  // ✅ Customer name
                email: 'john@example.com', 
                phone: '1234567890', 
                role: 'CUSTOMER', 
                token: 'mock-token-123' 
            };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        window.location.reload();
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
        switchRole,
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