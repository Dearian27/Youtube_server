import express from 'express';
import { updateUser, deleteUser, unsubscribe, subscribe, getUser, like, dislike, clearReactions } from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

// Update user
router.put("/:id", verifyToken, updateUser)

// Delete user
router.delete("/:id", verifyToken, deleteUser)

// Get the user
router.get("/:id", getUser)

// Subscribe the user
router.put("/subscribe/:id", verifyToken, subscribe)

// Unsubscribe the user
router.put("/unsubscribe/:id", verifyToken, unsubscribe)

// Like a video
router.put("/like/:id", verifyToken, like)

// Dislike a video
router.put("/dislike/:id", verifyToken, dislike)

router.put("/clear/:id", verifyToken, clearReactions)


export default router; 