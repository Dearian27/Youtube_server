import mongoose from 'mongoose';
const VideoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
    unique: true,
  },
  imgUrl: {
    type: String,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "pending",
  }
},
  {
    timestamps: true
  },
)
export default mongoose.model('Video', VideoSchema);