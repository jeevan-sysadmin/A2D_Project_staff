import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Modular imports
import { storage } from '../../firebase'; // Assuming you need storage for something else
import './StaffList.css';
import Sidebar from '../Sidebar';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const db = getFirestore(); // Initialize Firestore
      const usersCollection = collection(db, 'users'); // Reference to the 'users' collection
      const snapshot = await getDocs(usersCollection); // Get all docs in the collection
      const usersList = snapshot.docs.map(doc => doc.data()); // Extract data from docs
      setUsers(usersList);
    };

    fetchUsersData();
  }, []);

  return (
    <div className="users-page">
      <Sidebar className="sidebar" />
      <div className="users-table-container">
        <h2>Staff's Details</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="profile-pic"
                    />
                  ) : (
                    'No Profile Pic'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
