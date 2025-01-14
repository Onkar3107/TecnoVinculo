import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import DocumentDetails from './components/DocumentDetails'; 
import DocumentVersions from './components/DocumentVersions';
import DocumentForm from './components/DocumentForm'; 
import ThreeDBackground from './components/ThreeDBackground'; 
import './App.css';

function App() {
    const location = useLocation();

    const show3DBackground = 
        location.pathname === '/' || 
        location.pathname === '/login' || 
        location.pathname === '/register';

    return (
        <div className="app-container">
            {show3DBackground && (
                <div className="threeD-model-container">
                    <ThreeDBackground /> 
                </div>
            )}

            <Navbar />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/document/:id" element={<DocumentDetails />} />
                <Route path="/document/:id/versions" element={<DocumentVersions />} />
                <Route path="/document/new" element={<DocumentForm />} />
            </Routes>
        </div>
    );
}

export default App;
