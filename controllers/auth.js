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

    // res.status(200).json("user has been created");

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d'
      }
    )

    res.status(200).json({
      token, user, message: "user has been created"
    })

  } catch (error) {
    // res.json({ error: error.message });
    next(createError(404, "not found"));
  }

}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide name and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "not found"));
    }

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
      return next(createError(400, "wrong credentials"));
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d'
      }
    )
      console.log(token)
    res.status(200).json({
      token, user
    })

    // const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    // const { userPassword, ...other } = user._doc;
    // res.cookie("access_token", token, {
      // httpOnly: true,
    // }).status(200).json(other);

  } catch (error) {
    next(error);
  }
}

export const signInGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email:req.body.email, name:req.body.name});
    if(user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      
      res.cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      })
      const savedUser = await newUser.save();

      
      const token = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '30d'
        }
      )
  
      res.status(200).json({
        token, user
      })
      // const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY);
      // res.cookie("access_token", token, {
      //   httpOnly: true,
      // })
      // .status(200)
      // .json(savedUser._doc);
    }
  }catch(error) {
    next(error)
  }
}
