import jwt from 'jsonwebtoken';
import { createError } from './error.js';
export const verifyToken = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    const tokenType = req.headers.token_type || '';

    console.log("tt", tokenType, token);
    if (!token) return next(createError(401, "You are not authenticated"));
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      console.log('before 403')
      console.log("user", user)
      if (err) return next(createError(403, "Token verification failed"));
      console.log('before req.user')
    
    if(tokenType === 'google_oauth2') {
      req.user = {
        id: user.user_id,
        iat: user.iat
      }
      next();
      return;
    }
    req.user = user;
    next();
    console.log('after req.user')
  })
}
