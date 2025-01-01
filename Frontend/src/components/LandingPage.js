import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThreeDBackground from './ThreeDBackground';

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user data from localStorage
        setIsLoggedIn(false);
        navigate('/'); // Redirect to the landing page
    };

    return (
        <>
            <ThreeDBackground />
            <div
                className="container d-flex justify-content-center align-items-center"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    className="jumbotron p-5"
                    style={{
                        backgroundColor: 'transparent',
                        textAlign: 'center',
                    }}
                >
                    <h1
                        className="display-4"
                        style={{
                            color: '#fff',
                            textShadow: '0px 0px 10px rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        Welcome to TecnoVínculo
                    </h1>
                    <p
                        className="lead"
                        style={{
                            color: '#fff',
                            textShadow: '0px 0px 5px rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        TecnoVínculo is your go-to platform for seamless real-time collaboration. Work together on
                        documents, share ideas, and communicate effortlessly with your team.
                    </p>
                    <hr
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    />
                    <p
                        style={{
                            color: '#fff',
                            textShadow: '0px 0px 5px rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        Whether you're working on a team project or just need to organize your thoughts, TecnoVínculo
                        offers all the features you need to stay productive.
                    </p>
                    <div className="mt-4">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="btn btn-success btn-lg me-3"
                                    style={{
                                        backgroundColor: 'rgba(0, 123, 255, 0.8)',
                                        border: 'none',
                                    }}
                                >
                                    Go to Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-danger btn-lg"
                                    style={{
                                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                                        border: 'none',
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-lg me-3"
                                    style={{
                                        backgroundColor: 'rgba(0, 123, 255, 0.8)',
                                        border: 'none',
                                    }}
                                >
                                    Register
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn btn-danger btn-lg"
                                    style={{
                                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                                        border: 'none',
                                    }}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
