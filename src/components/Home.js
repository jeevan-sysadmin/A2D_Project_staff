// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Sidebar from '../components/Sidebar';
import logo from '../assets/img/logo.png'; // Import the logo image
import './Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <h1>Welcome to the A2d PC Factory Admin panel</h1>
        <p>Select an option from the sidebar to manage your data.</p>
      </div>

      {/* Center the logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Home;
