import jwt from 'jsonwebtoken';
import { createError } from './error.js';
export const verifyToken = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (!token) return next(createError(401, "You are not authenticated"));
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, "Token verification failed"));
    req.user = user;
    next();
  })
}
