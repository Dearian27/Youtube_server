import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { createError } from '../error.js';

export const addComment = async (req, res, next) => {
  try {
    const comment = new Comment({ userId: req.user.id, ...req.body })
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}


export const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}


export const deleteComment = async (req, res, next) => {
  try {
    // videoId, userId, text
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id)
    if (comment.userId === req.user.id || video.userId === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Comment deleted successfully");
    }
    else {
      next(createError(403, 'You cannot delete this comment'));
    }
  } catch (error) {
    next(error);
  }
}