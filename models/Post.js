const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Post Schema
const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    placeName: {
      type: String,
      required: true,
      trim: true,
    },
    placeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    placeLocation: {
      accuracy: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      altitude: { type: Number, required: true },
      heading: { type: Number, required: true },
      altitudeAccuracy: { type: Number, required: true },
      speed: { type: Number, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to the separate Comment schema
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

// Create and export the model


module.exports = mongoose.model("Post", postSchema);
