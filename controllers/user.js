import { createError } from '../error.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id,
        { $set: req.body },
        { new: true }
      )
      await updatedUser.save();

      res.status(200).json(updatedUser);
    }
    catch (err) {
      next(err);
    }
  }
  else {
    return next(createError(403, "You do not have permission to update this user"));
  }
}

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({ message: "User has been deleted" });
    }
    catch (err) {
      next(err);
    }
  }
  else {
    return next(createError(403, "You do not have permission to delete this user"));
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const isSubscribed = user?.subscribedUsers?.find(user => user === req.user.id);
    if (isSubscribed || req.user.id === req.params.id) {
      //? cannot subscribe to yourself or secondly
      if(isSubscribed) {
        return next(createError(418, "You have already subscribed"));
      } else {
        return next(createError(418, "You do not have permission to subscribe on your channel"));
      }
    }
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id }
    })
    await User.findByIdAndUpdate(req.params.id, {
      $push: { subscribers: req.user.id }
    })
    res.status(200).json("Subscribtion successfull");
  } catch (error) {
    next(error);
  }
}

export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id }
    })
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { subscribers: req.user.id }
    })
    res.status(200).json("Unsubscribtion successfull");
  } catch (error) {
    next(error);
  }
}

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.id;
  try {   
      await Video.findByIdAndUpdate(videoId, {
        $addToSet: { likes: id },
        $pull: { dislikes: id }
      })
    res.status(200).json({message: "liked successfull"});
  } catch (error) {
    next(error)
  }
}


export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id }
    })
    res.status(200).json({message: "disliked successfull"});
  } catch (error) {
    next(error)
  }
}