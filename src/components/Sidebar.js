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

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li onClick={() => navigate('/forms-data')}>Forms Data</li>
        <li onClick={() => navigate('/export-data')}>Export Data</li>
        <li onClick={() => navigate('/delete-data')}>Delete Data</li>
      </ul>
      <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Sidebar;
