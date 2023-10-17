import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const isSignedUp = await User.findOne({ email });
    if (isSignedUp) {
      return res.status(400).json({ error: 'User already exists', reason: "user" });
    }
    const isDublicatedName = await User.findOne({ name });
    if (isDublicatedName) {
      res.status(400).json({ error: 'This username is alreasy used', reason: "name" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
    const { userPassword, ...other } = newUser._doc;
    res.status(200).json({
      token,
      user: other,
      message: "user has been created"
    });
  } catch (error) {
    next(createError(404, "not found"));
  }

}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide name and password', reason: "email"});
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({reason: "email"});
      return next(createError(404, "not found"));
    }
    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
      res.status(400).json({reason: "password"});
      return next(createError(400, "wrong credentials"));
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    const { userPassword, ...other } = user._doc;
    res.status(200).json({user: other, token});
  } catch (error) {
    next(error);
  }
}

export const signInGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email:req.body.email, name:req.body.name});
    if(user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      res.status(200).json({user: user._doc, token});
    } 
    const newUser = new User({
      ...req.body,
      fromGoogle: true,
    })
    const savedUser = await newUser.save();   
    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY);
    res.status(200).json({
      user: savedUser, token
    })
  }catch(error) {
    next(error)
  }
}
