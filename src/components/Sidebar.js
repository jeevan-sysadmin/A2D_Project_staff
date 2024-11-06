// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  // Function to handle user sign-out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // Redirect to the sign-in page after logging out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Function to navigate to home when Admin Panel is clicked
  const handleAdminPanelClick = () => {
    navigate('/home'); // Redirect to /home when Admin Panel is clicked
  };

  return (
    <div className="sidebar">
      {/* Clickable Admin Panel */}
      <h2 onClick={handleAdminPanelClick} className="admin-panel-title">Admin Panel</h2>

      <ul>
        <li onClick={() => navigate('/forms-data')}>Forms Data</li>
        <li onClick={() => navigate('/Analysis')}>ProcessAnalysis</li>
        <li onClick={() => navigate('/Staffs')}>Staffs</li>
      </ul>

      <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Sidebar;
