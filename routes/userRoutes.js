const express = require("express");
const {
  getAllUsers,
  createUser,
  getProfile,
  updateProfile,
  addPost,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/get-profile", getProfile);
router.post("/update-profile", updateProfile);
router.post("/add-post", addPost);

module.exports = router;
