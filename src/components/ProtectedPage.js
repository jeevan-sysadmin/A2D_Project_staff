// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const ProtectedPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  if (!user) return <p>Please sign in to view this page.</p>;

  return <h2>Welcome, {user.displayName}!</h2>;
};

export default ProtectedPage;
