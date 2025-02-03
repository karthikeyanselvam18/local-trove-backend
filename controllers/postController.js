const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment"); // Import the Comment model
const mongoose = require("mongoose");

// Add a new post
exports.addPost = async (req, res) => {
  const {
    userId,
    caption,
    description,
    media,
    placeName,
    placeAddress,
    placeLocation,
  } = req.body;

  try {
    if (!userId || !caption) {
      return res.status(400).json({
        message:
          "userId, caption, description, placeName, placeAddress, placeLocation are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      user: userId,
      caption,
      description: description || "",
      media: media || "",
      placeName,
      placeAddress,
      placeLocation,
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImage") // Populate username and profileImage for the post's user
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profileImage", // Populate username and profileImage for the user who commented
        },
      })
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Fetch posts by a specific user
exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId }).populate(
      "user",
      "username profileImage"
    ); // Populate username and profileImage for the post's user
    if (!posts.length) {
      return res
        .status(404)
        .json({ message: `No posts found for user with ID ${userId}` });
    }

    return res.status(200).json(posts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user's posts", error: error.message });
  }
};

// Fetch a specific post by ID and check if it's the current user's post
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId)
      .populate("user", "username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profileImage",
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isCurrentUserPost = post.user._id.toString() === userId;

    return res.status(200).json({ post, isCurrentUserPost });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

// Like or Dislike a Post
exports.toggleLike = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const likedIndex = post.likes.findIndex((id) => id.equals(userObjectId));

    if (likedIndex !== -1) {
      post.likes.splice(likedIndex, 1);
      await post.save();
      return res
        .status(200)
        .json({ isLiked: false, message: "Post disliked", post });
    }

    post.likes.push(userObjectId);
    await post.save();
    return res.status(200).json({ isLiked: true, message: "Post liked", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking/disliking post", error: error.message });
  }
};

// Check if a user has liked a post
exports.checkLikeStatus = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = post.likes.some((id) => id.equals(userObjectId));

    return res.status(200).json({ isLiked });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking like status", error: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  const { postId, userId, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = new Comment({
      user: userId,
      post: postId,
      text: comment,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    return res
      .status(200)
      .json({ message: "Comment added successfully", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

// Remove a comment
exports.removeComment = async (req, res) => {
  const { postId, userId, commentId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Comment.deleteOne({ _id: commentId });

    post.comments = post.comments.filter(
      (commentId) => commentId.toString() !== commentId
    );
    await post.save();

    return res.status(200).json({ message: "Comment removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing comment", error: error.message });
  }
};

// Edit a comment
exports.editComment = async (req, res) => {
  const { postId, userId, commentId, newComment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    comment.text = newComment;
    comment.isEdited = true;
    await comment.save();

    return res
      .status(200)
      .json({ message: "Comment edited successfully", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing comment", error: error.message });
  }
};
