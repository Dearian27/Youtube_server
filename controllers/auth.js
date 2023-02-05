import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isSignedUp = await User.findOne({ email });
    if (isSignedUp) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const isDublicatedName = await User.findOne({ name });
    if (isDublicatedName) {
      res.json({ error: 'This username is alreasy used' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    res.status(200).json("user has been created");

  } catch (error) {
    // res.json({ error: error.message });
    next(createError(404, "not found"));
  }

}

export const signIn = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Please provide name and password' });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return next(createError(404, "not found"));
    }

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
      return next(createError(400, "wrong credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    const { userPassword, ...other } = user._doc;
    res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(other);

  } catch (error) {
    next(error);
  }

  // const token = req.body.token
}
