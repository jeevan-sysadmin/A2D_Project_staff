// src/components/Sidebar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar closed on mobile by default

  // Function to handle user sign-out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // Redirect to the sign-in page after logging out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to navigate to home when Admin Panel is clicked
  const handleAdminPanelClick = () => {
    navigate('/home'); // Redirect to /home when Admin Panel is clicked
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      {/* Hamburger icon to toggle sidebar */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="sidebar-content">
        {/* Clickable Admin Panel */}
        <h2 onClick={handleAdminPanelClick} className="admin-panel-title">Admin Panel</h2>

        <ul>
          <li onClick={() => navigate('/forms-data')}>Forms Data</li>
          <li onClick={() => navigate('/Analysis')}>Analysis</li>
          <li onClick={() => navigate('/Staffs')}>Staffs</li>
        </ul>

        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default Sidebar;
