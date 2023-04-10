import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  subscribers: {
    type: [String],
    default: [],
  },
  subscribedUsers: {
    type: [String],
    // default: [],
  },
  fromGoogle: {
    type: Boolean,
    default: false,
  }
},
  {
    timestamps: true
  },
)

export default mongoose.model('User', UserSchema);