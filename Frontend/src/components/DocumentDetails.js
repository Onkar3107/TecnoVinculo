import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDocumentById, updateDocument, deleteDocument } from '../services/documentService';
import { io } from 'socket.io-client';



const DocumentDetails = () => {
    const socket = io('http://localhost:5000');

    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const location = useLocation();
    const message = location.state?.message;
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const doc = await getDocumentById(id);
                setDocument(doc);
                setTitle(doc.title);
                setContent(doc.content);
            } catch (error) {
                setError('Failed to fetch document');
            }
        };
        fetchDocument();
    }, [id]);

    useEffect(() => {
        
        // Join the document room
        socket.emit('joinDocument', id);

        // Listen for real-time updates
        socket.on('receiveUpdate', (updatedData) => {
            if (updatedData.title) {
                setTitle(updatedData.title);
            }
            if (updatedData.content) {
                setContent(updatedData.content);
            }
        });

        socket.on('receiveUpdatedTitle', (updatedContent) => {
      
            setContent(updatedContent);
        
    });
        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, [id, socket]);

    const handleUpdate = async () => {
        try {
            await updateDocument(id, { title, content });
            socket.emit('documentUpdate', { documentId: id, title, content });
            setSuccessMessage('Document updated successfully!');
            navigate(`/document/${id}`);
        } catch (error) {
            setError('Failed to update document');
        }
    };
    

    const handleDelete = async () => {
        try {
            await deleteDocument(id);
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to delete document');
        }
    };

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!document) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            {message && <div className="alert alert-success mt-3">{message}</div>}
            <h2 className="mb-4">Document Details</h2>
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => {setTitle(e.target.value);
                        socket.emit('documentUpdate', { documentId: id, title: e.target.value, content });
                    }}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    className="form-control"
                    rows="5"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        socket.emit('documentUpdate', { documentId: id, title, content: e.target.value });
                    }}
                />
            </div>
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}

            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleUpdate}>Update Document</button>
                <button className="btn btn-danger ms-2" onClick={handleDelete}>Delete Document</button>
            </div>
        </div>
    );
};

export default DocumentDetails;
