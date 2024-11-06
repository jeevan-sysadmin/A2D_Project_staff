// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Sidebar from '../components/Sidebar';


const Home = () => {
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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>Welcome to the Dashboard</h1>
        <p>Select an option from the sidebar to manage your data.</p>
      </div>
    </div>
  );
};

export default Home;
