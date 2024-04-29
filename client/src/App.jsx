import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import HomePage from './pages/home';
import StudentLog from './pages/studentLog';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import Navbar from './components/navbar';
import Enrollment from './pages/enrollment';
import Test from './components/test';
import Profile from './pages/profile';
import EditProfile from './pages/editprofile';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const timeoutMessageId = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutMessageId);
    };
  }, []);

  useEffect(() => {
    // Hide timeout message when user is authenticated and navigate back to home page
    if (isAuthenticated) {
      setShowTimeoutMessage(false);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar setLoading={setLoading} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <HashLoader color={'#36D7B7'} loading={loading} size={50} />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/student-logs" element={isAuthenticated ? <StudentLog /> : <Navigate to="/login" />} />
          <Route path='/enrollment' element={<Enrollment/>} />
          <Route path='/test' element={<Test/>} />
          <Route path='/profile/:studentId' element={<Profile/>}/>
          <Route path='/edit-profile/:studentId' element={<EditProfile />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/homepage" /> : <Navigate to="/login" />} />
        </Routes>
      )}
      {!isAuthenticated && !loading && showTimeoutMessage && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h2>Your session is about to expire. Please log in again.</h2>
          <Navigate to="/login" />
        </div>
      )}
      {!isAuthenticated && !loading && !showTimeoutMessage && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h2>Your session has expired. Please log in again.</h2>
          <Navigate to="/login" replace={true} />
        </div>
      )}
    </Router>
  );
}

export default App;
