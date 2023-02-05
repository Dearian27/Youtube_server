import express from 'express';
import { signUp, signIn } from '../controllers/auth.js';

const router = express.Router();

//Create new user
router.post('/signup', signUp);

//Sign in
router.post('/signIn', signIn);

//Google authentication

export default router; 