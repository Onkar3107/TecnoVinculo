import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import DocumentDetails from './components/DocumentDetails'; // Assuming you have this component
import DocumentForm from './components/DocumentForm'; // Assuming you have this component
import ThreeDBackground from './components/ThreeDBackground'; // Import 3D background
import './App.css';

function App() {
    const location = useLocation();

    // Check if the current route matches the pages that should have the 3D background
    const show3DBackground = 
        location.pathname === '/' || 
        location.pathname === '/login' || 
        location.pathname === '/register';

    return (
        <div className="app-container">
            {/* Conditionally render the 3D background only for specific pages */}
            {show3DBackground && (
                <div className="threeD-model-container">
                    <ThreeDBackground /> {/* Render the 3D background */}
                </div>
            )}

            {/* Navbar */}
            <Navbar />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/document/:id" element={<DocumentDetails />} />
                <Route path="/document/new" element={<DocumentForm />} />
            </Routes>
        </div>
    );
}

export default App;
