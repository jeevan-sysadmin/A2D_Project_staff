// src/components/SignUp.js
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Sign up with email and password
  const signUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      // Redirect to the home page after signup
      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error('Error signing up with email:', error.message);
    }
  };

  // Sign up with Google
  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirect to the home page after Google signup
      navigate('/home');
    } catch (error) {
      console.error('Error signing up with Google:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={signUpWithEmail}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>

      <hr />

      <button onClick={signUpWithGoogle}>Sign up with Google</button>
    </div>
  );
};

export default SignUp;
