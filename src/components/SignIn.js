// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To programmatically navigate to other routes

  // Function for email/password sign-in
  const signInWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirect to the homepage on successful login
    } catch (error) {
      setError(error.message);
      console.error('Error signing in with email:', error.message);
    }
  };

  // Function for Google sign-in
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home'); // Redirect to the homepage on successful Google login
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      
      {/* Email and Password Login Form */}
      <form onSubmit={signInWithEmail}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign in with Email</button>
      </form>

      <hr />

      {/* Google Sign-In Button */}
      <button onClick={signInWithGoogle}>Sign in with Google</button>

      <hr />

      {/* Create Account Button */}
      <button onClick={() => navigate('/signup')}>Create Account</button>
    </div>
  );
};

export default SignIn;
