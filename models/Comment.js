import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    default: 0,
  },
},
  {
    timestamps: true
  },
)

export default mongoose.model('Comment', CommentSchema);