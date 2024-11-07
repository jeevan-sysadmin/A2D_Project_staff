import React from 'react';

import './Layout.css'; // Import the CSS for the layout

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      
      <div style={{ marginLeft: '120px'}}className="content">{children}</div> {/* Main content */}
    </div>
  );
};

export default Layout;
