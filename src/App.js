import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ProtectedPage from './components/ProtectedPage';
import { auth } from './firebase';
import Home from './components/Home';

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/protected"
          element={user ? <ProtectedPage /> : <SignIn />}
        />
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </Router>
  );
};

export default App;
