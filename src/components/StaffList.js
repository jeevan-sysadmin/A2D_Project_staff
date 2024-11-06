import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Import Firebase Authentication

const StaffList = () => {
  const [user, setUser] = useState(null);  // To store the authenticated user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user data from Firebase Authentication
  const fetchUserData = () => {
    const currentUser = auth.currentUser; // Get the current authenticated user

    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'No Display Name', // Use displayName if available
        photoURL: currentUser.photoURL || 'https://www.example.com/default-avatar.jpg', // Default image if no photo
      });
      setLoading(false);
    } else {
      setError('No user is authenticated');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="staff-list">
      <h1>Authenticated User Information</h1>
      {user ? (
        <div>
          <p><strong>UID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.displayName}</p>
          <p>
            <strong>Profile Picture:</strong>
            <img src={user.photoURL} alt="Profile" width="100" height="100" />
          </p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default StaffList;
