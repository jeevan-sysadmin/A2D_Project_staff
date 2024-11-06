// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

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
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>You have successfully logged in.</p>

      {/* Sign-out button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Home;
