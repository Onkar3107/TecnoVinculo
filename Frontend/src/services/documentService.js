import axios from 'axios';

const API_URL = 'https://tecnovinculo.onrender.com/api/documents';
const user = JSON.parse(localStorage.getItem('user'));
// Extract the token from the parsed object
const token = user ? user.token : null;
export const getDocuments = async () => {
    const { data } = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const getDocumentById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

// Update a document by ID
export const updateDocument = async (id, documentData) => {
    const { data } = await axios.put(`${API_URL}/${id}`, documentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

// Delete a document by ID
export const deleteDocument = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const getVersions = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}/versions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export const restoreVersion = async (id, versionId) => {
    const { data } = await axios.post(`${API_URL}/${id}/restore/${versionId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}
