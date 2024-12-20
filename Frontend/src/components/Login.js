import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDBackground from './ThreeDBackground'; // Import the ThreeDBackground component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Handle login logic here (e.g., API call)

        // Uncomment the following code and configure axios for backend communication
        // try {
        //     const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });

        //     // Save user data in local storage
        //     localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));

        //     // Navigate to dashboard
        //     navigate('/dashboard');
        // } catch (error) {
        //     if (error.response && error.response.data && error.response.data.message) {
        //         setError(error.response.data.message); 
        //     } else {
        //         setError('An unexpected error occurred. Please try again later.');
        //     }
        // }
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
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                <p style={{ marginTop: '1rem' }}>
                    Don't have an account? <a href="/register" style={{ color: '#0b5ed7' }}>Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
