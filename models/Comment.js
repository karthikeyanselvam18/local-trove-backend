const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Comment Schema
const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to Post schema
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

// Create and export the model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
