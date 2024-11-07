// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Home from './pages/HomePage';
import ProcessAnalysis from './pages/ProcessPage';
import ProtectedPage from './components/ProtectedPage';
import StaffList from './pages/StaffPage';
import FormsData from './pages/FormsPage'; // Import FormsData component
import Layout from './components/Layout';
import { auth } from './firebase';
import Watermark from './components/Watermark/Watermark'; // Adjust path based on your file structure

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
      <div>
        {/* Watermark component inside Router */}
        <Watermark />

        <Routes>
          <Route path="/signin" element={<SignIn />} />

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
          <Route
            path="/Staffs"
            element={user ? <Layout><StaffList /></Layout> : <Navigate to="/signin" />}
          />
          <Route
            path="/Analysis"
            element={user ? <Layout><ProcessAnalysis /></Layout> : <Navigate to="/signin" />}
          />

          {/* Default route - redirect to /signin if not authenticated */}
          <Route
            path="/"
            element={<Navigate to={user ? "/home" : "/signin"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
