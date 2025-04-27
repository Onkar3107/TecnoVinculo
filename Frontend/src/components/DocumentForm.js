import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

const DocumentForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // Extract the token from the parsed object
      const token = user ? user.token : null;

      const { data } = await axios.post(
        "https://tecnovinculo.onrender.com/api/documents",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/document/${data._id}`, {
        state: { message: "Document created successfully!" },
      });
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <div className="container">
      <h2>Create New Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <div
            style={{
              border: "1px solid #ced4da",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={content}
              onChange={(value) => setContent(value)}
              theme="vs-dark" // You can change the theme to 'light' or others.
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;
