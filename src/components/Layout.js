// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        {children} {/* Render the page content here */}
      </div>
    </div>
  );
};

export default Layout;
