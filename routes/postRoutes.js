const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/add-post", postController.addPost);
router.get("/posts", postController.getPosts);
router.get("/posts/user/:userId", postController.getPostsByUser);
router.post("/post/:postId", postController.getPostById);
router.post("/like", postController.toggleLike);
router.post('/check-like-status', postController.checkLikeStatus);
router.post("/add-comment", postController.addComment);
router.post("/remove-comment", postController.removeComment);
router.post("/edit-comment", postController.editComment);

module.exports = router;
