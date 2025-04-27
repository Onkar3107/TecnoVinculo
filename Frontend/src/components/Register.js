import React, { useState } from 'react';
import ThreeDBackground from './ThreeDBackground'; // Import the ThreeDBackground component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        // Handle registration logic here (e.g., API call)

        setError(''); // Clear any previous errors
        try {
            const { data } = await axios.post('https://tecnovinculo.onrender.com/api/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            navigate('/login'); // Redirect to login if registration is successful
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Set error message if registration fails
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative', // Position relative to place background behind
    };

    const formContainerStyle = {
        background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
        backdropFilter: 'blur(10px)', // Apply blur effect for glassmorphism
        borderRadius: '10px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        color: '#fff', // White text for visibility
        border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for glass effect
    };

    const inputStyle = {
        marginBottom: '1rem',
        padding: '0.5rem',
        borderRadius: '5px',
        border: '1px solid rgba(255, 255, 255, 0.5)', // Visible border
        background: 'transparent', // Transparent background for inputs
        color: '#fff', // White text for input fields
    };

    const buttonStyle = {
        background: 'rgba(31, 38, 135, 0.8)', // Slightly transparent background
        border: 'none',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
    };

    return (
        <div style={containerStyle}>
            <ThreeDBackground /> {/* Add the 3D background */}
            <div style={formContainerStyle}>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        style={inputStyle}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={inputStyle}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={buttonStyle}>Register</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                <p style={{ marginTop: '1rem' }}>
                    Already have an account? <a href="/login" style={{ color: '#0b5ed7' }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
