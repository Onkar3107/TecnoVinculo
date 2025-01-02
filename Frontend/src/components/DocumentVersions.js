import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVersions, restoreVersion } from "../services/documentService"; // Make sure to add the restoreVersion service function

const DocumentVersions = () => {
  const { id } = useParams(); // Get document ID from URL
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const versionsData = await getVersions(id);
        setVersions(versionsData);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === "No version history found") {
            // setError("This document has no version history");
            setTimeout(() => {
                navigate(`/document/${id}`); // Redirect to the document details page
            }, 2500);
        } else {
            setError('Failed to fetch document versions');
        }
      }
    };
    fetchVersions();
  }, [id]);

  const handleRestore = async (versionId) => {
    try {
      // Assuming restoreVersion is a service function that restores the document to the selected version
      await restoreVersion(id, versionId);
      alert("Document restored to the selected version.");
      navigate(`/document/${id}`); // Redirect to the document details page after restoring
    } catch (error) {
      setError("Failed to restore the document version");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px", margin: "auto" }}>
      <h2 className="mb-4 text-center text-white">Document Versions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Scrollable container for versions */}
      <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "10px" }}>
        {versions.length === 0 ? (
          <div className="text-light">No versions available for this document. Redirecting please wait..</div>
        ) : (
          versions.map((version) => (
            <div
              key={version._id}
              className="version-card p-4 mb-3 border rounded shadow-sm bg-dark text-white"
            >
              <h4 className="mb-3">{version.title}</h4>
              <p className="text-light">Version: {version.version}</p>
              <p className="text-light">
                Modified on: {new Date(version.updated_at).toLocaleString()}
              </p>
              <button
                className="btn btn-success w-100"
                onClick={() => handleRestore(version._id)}
              >
                Restore Version
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentVersions;
