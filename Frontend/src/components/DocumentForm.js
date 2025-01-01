import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DocumentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
                // Extract the token from the parsed object
                const token = user ? user.token : null;
            const { data } = await axios.post('http://localhost:5000/api/documents', { title, content }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate(`/document/${data._id}`,{ state: { message: 'Document created successfully!' } });
        } catch (error) {
            console.error('Failed to create document:', error);
        }
    };

    return (
        <div className="container">
            <h2>Create New Document</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea className="form-control" id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default DocumentForm;
