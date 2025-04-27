const mongoose = require("mongoose");
const express = require("express");
const { verifyToken } = require("../middleware/auth"); // Import the verifyToken middleware
const router = express.Router();
const Document = require("../models/Document");

// Get all documents
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single document
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new document
router.post("/", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  const newDocument = new Document({
    title,
    content,
    userId: req.user.id, // Store the logged-in user's ID
  });

  try {
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update a document and handle versioning
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Update the document fields
    if (title) document.title = title;
    if (content) document.content = content;

    await document.save(); // Versioning handled in the pre-save hook
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a document
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Check if the logged-in user is the creator of the document
    if (document.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this document" });
    }

    // Delete the document
    await document.delete();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get version history of a document
router.get("/:id/versions", async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    // Find the document by ID
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if versionHistory exists and has data
    if (!document.versionHistory || document.versionHistory.length === 0) {
      return res.status(404).json({ message: "No version history found" });
    }

    // Respond with version history
    res.status(200).json(document.versionHistory);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
  }
});

// Restore a specific version of a document
router.post("/:id/restore/:version", verifyToken, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    // Find the document
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the logged-in user is the creator of the document
    if (document.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to restore this document version",
        });
    }

    // Find the version to restore using _id
    const versionToRestore = document.versionHistory.find(
      (v) => v._id.toString() === req.params.version
    );

    if (!versionToRestore) {
      return res.status(404).json({ message: "Version not found" });
    }

    // Restore version data
    document.title = versionToRestore.title;
    document.content = versionToRestore.content;

    // Save the document (creates a new version)
    await document.save();

    res.status(200).json(document);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
