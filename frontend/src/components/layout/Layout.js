import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;