import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for fetching documents
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('User not authenticated. Redirecting to login.');
                }

                setLoading(true); // Start loading state before fetching
                const { data } = await axios.get('http://localhost:5000/api/documents', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                console.log('Fetched documents:', data); // Debug API response
                setDocuments(data);
            } catch (err) {
                console.error('Error fetching documents:', err.message || err);
                setError(err.message || 'Failed to fetch documents.');
            } finally {
                setLoading(false); // Stop loading state once data is fetched
            }
        };

        fetchDocuments();
    }, [navigate]);

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 d-flex flex-column">
            <h2 className="my-4 text-center">Dashboard</h2>

            {/* Show loading spinner while fetching */}
            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Show error if any */}
            {error && (
                <div className="container-fluid bg-dark text-white min-vh-100 d-flex flex-column">
                    <h2 className="text-danger my-4 text-center">Error</h2>
                    <p className="text-center">{error}</p>
                </div>
            )}

            {/* Render documents */}
            {!loading && !error && (
                <>
                    {documents.length === 0 ? (
                        <p className="text-center">No documents found. Create a new one to get started!</p>
                    ) : (
                        <div className="row">
                            {documents.map((doc) => (
                                <div key={doc._id} className="col-md-4 mb-4">
                                    <div className="card h-100 bg-secondary text-white shadow-lg border-0">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{doc.title}</h5>
                                            <p className="card-text">
                                                Created on: {new Date(doc.created_at).toLocaleDateString()}
                                            </p>
                                            <Link to={`/document/${doc._id}`} className="btn btn-primary mt-auto">
                                                Open Document
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Create New Document Button */}
            <div className="text-center mt-4 pt-3">
                <button
                    className="btn btn-success"
                    style={{ minWidth: '200px' }} // Ensure button is visible with proper width
                    onClick={() => {
                        console.log('Navigating to Create New Document page');
                        navigate('/document/new');
                    }}
                >
                    Create New Document
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
