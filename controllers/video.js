import Video from '../models/Video.js';
import User from '../models/User.js';
import { createError } from '../error.js';

export const addVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({ ...req.body, userId: req.user.id });
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
}

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError("Video not found."));
    }
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }
        , { new: true }
      )
      res.status(200).json(updatedVideo);
    }
    else {
      res.status(403, "You cannot update this video.");
    }
  } catch (error) {
    console.log("error updating");
    next(error);
  }
}

export const deleteVideo = async (req, res, next) => {
  console.log('1')
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(createError("Video not found."));
    }
    if (req.user.id === video.userId) {
      console.log('3')
      await Video.findByIdAndDelete(req.params.id);
      console.log('4')
      res.status(200).json("Video has been deleted successfully.");
    }
    else {
      res.status(403, "You cannot delete this video.");
    }
  } catch (error) {
    next(error);
  }
}

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found."));
    }
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
}


export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });
    res.status(200).json("The view has been incremented.");
  } catch (error) {
    next(error);
  }
}


export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 12 } }]);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
}


export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
}


export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId })
      })
    )
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
}

export const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  console.log(tags);
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    // const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
}


export const search = async (req, res, next) => {
  const query = req.query.query;
  console.log("req.query.q", req.query.query)
  console.log("req.query", req.query)
  try {
    const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).limit(30);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
}