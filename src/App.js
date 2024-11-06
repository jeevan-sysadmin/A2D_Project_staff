// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import ProtectedPage from './components/ProtectedPage';
import FormsData from './components/FormsData'; // Import FormsData component
import Layout from './components/Layout';
import { auth } from './firebase';

const App = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);  // Stop loading once authentication state is checked
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;  // Show a loading message until auth state is checked
  }

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Wrap protected routes with Layout to ensure Sidebar is visible */}
        <Route
          path="/home"
          element={user ? <Layout><Home /></Layout> : <Navigate to="/signin" />}
        />
        <Route
          path="/protected"
          element={user ? <Layout><ProtectedPage /></Layout> : <Navigate to="/signin" />}
        />
        <Route
          path="/forms-data"
          element={user ? <Layout><FormsData /></Layout> : <Navigate to="/signin" />}
        />

        {/* Default route - redirect to home if user is logged in */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
