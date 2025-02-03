const User = require("../models/User");
const Post = require("../models/Post");

// Get all users (for testing)
exports.getAllUsers = (req, res) => {
  res.send("Get all users");
};

// Create a new user (for testing)
exports.createUser = (req, res) => {
  res.send("Create a new user");
};

// Get User Profile
exports.getProfile = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  const { userId, username, bio, profileImage } = req.body;
  console.log({ userId, username, bio, profileImage });

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.bio = bio;
    user.profileImage = profileImage;
    await user.save();

    return res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new post
exports.addPost = async (req, res) => {
  const { userId, caption, description, media } = req.body;

  try {
    if (!userId || !caption) {
      return res
        .status(400)
        .json({ message: "userId, caption, and description are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      user: userId,
      caption,
      description,
      media: media || "",
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
