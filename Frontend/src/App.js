import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ThreeDBackground from './components/ThreeDBackground'; // Import the 3D model
import './App.css';

function App() {
    return (
        <Router>
            <div className="threeD-model-container">
                <ThreeDBackground /> {/* Render the 3D background */}
            </div>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
            </Routes>
        </Router>
    );
}

export default App;



    