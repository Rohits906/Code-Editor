const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: false,
  },
  filename: { type: String, required: true },
  type: { type: String, default: 'js' },
  content: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
