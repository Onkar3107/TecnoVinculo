const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    versionHistory: [
        {
            version: Number,
            title: String,
            content: String,
            updated_at: { type: Date, default: Date.now },
        },
    ],
});

// Pre-save middleware to handle versioning
documentSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.version++;
        this.versionHistory.push({
            version: this.version - 1,
            title: this.title,
            content: this.content,
            updated_at: new Date(),
        });
    }
    next();
});

module.exports = mongoose.model('Document', documentSchema);
