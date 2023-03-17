import express from 'express';
import { signUp, signIn, signInGoogle } from '../controllers/auth.js';

const router = express.Router();

//Create new user
router.post('/signup', signUp);

//Sign in
router.post('/signin', signIn);

// Sign in with Google account
router.post('/google', signInGoogle);

//Google authentication

export default router; 