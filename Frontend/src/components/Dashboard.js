import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching documents
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedDoc, setSelectedDoc] = useState(null); // Selected document for deletion
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          throw new Error("User not authenticated. Redirecting to login.");
        }

        setLoading(true); // Start loading state before fetching
        const { data } = await axios.get(
          "https://tecnovinculo.onrender.com/api/documents",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err.message || err);
        setError(err.message || "Failed to fetch documents.");
      } finally {
        setLoading(false); // Stop loading state once data is fetched
      }
    };

    fetchDocuments();
  }, [navigate]);

  const handleDeleteClick = (doc) => {
    setSelectedDoc(doc); // Set the document to be deleted
    setShowModal(true); // Show confirmation modal
  };

  const confirmDelete = async () => {
    if (!selectedDoc) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        throw new Error("User not authenticated.");
      }

      await axios.delete(
        `https://tecnovinculo.onrender.com/api/documents/${selectedDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Remove the document from the state after successful deletion
      setDocuments(documents.filter((doc) => doc._id !== selectedDoc._id));
      // alert('Document deleted successfully!');
    } catch (err) {
      console.log(err.response?.data?.message);
      alert(err.response?.data?.message || "Failed to delete document.");
    } finally {
      setShowModal(false); // Close modal
      setSelectedDoc(null); // Clear selected document
    }
  };

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
            <p className="text-center">
              No documents found. Create a new one to get started!
            </p>
          ) : (
            <div className="row">
              {documents.map((doc) => (
                <div key={doc._id} className="col-md-4 mb-4 position-relative">
                  <div className="card h-100 bg-secondary text-white shadow-lg border-0">
                    {/* Dustbin icon */}
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                      }}
                      title="Delete Document"
                    >
                      <i
                        style={{
                          color: "#adb5bd", // Subtle gray color
                          cursor: "pointer",
                          fontSize: "1.2rem", // Reduced size
                          transition: "color 0.3s ease", // Smooth hover effect
                        }}
                        className="fas fa-trash"
                        onClick={() => handleDeleteClick(doc)}
                        onMouseOver={(e) => (e.target.style.color = "#495057")} // Darker gray on hover
                        onMouseOut={(e) => (e.target.style.color = "#adb5bd")} // Return to light gray
                      />
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{doc.title}</h5>
                      <p className="card-text">
                        Created on:{" "}
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      <Link
                        to={`/document/${doc._id}`}
                        className="btn btn-primary mt-auto"
                      >
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
          style={{ minWidth: "200px" }} // Ensure button is visible with proper width
          onClick={() => navigate("/document/new")}
        >
          Create New Document
        </button>
      </div>

      {/* Confirmation Modal with custom black theme */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal" // Custom class to apply styles
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          Are you sure you want to delete the document{" "}
          <strong>{selectedDoc?.title}</strong>?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom modal styles */}
      <style>
        {`
                    .custom-modal .modal-content {
                        background-color: #343a40; /* Dark background */
                        color: white; /* White text */
                    }
                    .custom-modal .modal-header,
                    .custom-modal .modal-footer {
                        background-color: #212529; /* Darker footer and header */
                    }
                `}
      </style>
    </div>
  );
};

export default Dashboard;
