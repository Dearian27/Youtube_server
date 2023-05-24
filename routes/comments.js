import express from 'express';
import { addComment, deleteComment, getComments } from '../controllers/comment.js';
import { verifyToken } from '../verifyToken.js';
const router = express.Router();
router.post('/:id', verifyToken, addComment);
router.delete('/:id', verifyToken, deleteComment);
router.get('/:id', getComments);
export default router; 