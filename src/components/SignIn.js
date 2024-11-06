// src/components/SignIn.js
import React from 'react';
import { auth, googleProvider } from '../firebase';

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
