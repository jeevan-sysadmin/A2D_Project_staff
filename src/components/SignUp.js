import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // Save additional user information (e.g., name) to Firestore or Firebase Realtime Database
      const user = userCredential.user;
      await user.updateProfile({ displayName: name });
      console.log('User created:', user);
    } catch (error) {
      setError(error.message);
      console.error('Error signing up with email:', error.message);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
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
