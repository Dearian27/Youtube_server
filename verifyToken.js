// import jwt from 'jsonwebtoken';
// import { createError } from './error.js';

// export const verifyToken = (req, res, next) => {
  //   const token = req.cookies.access_token;
  //   if (!token) return next(createError(401, "You are not authenticated"));
  
  //   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//     if (err) return next(createError(403, "Token verification failed"));
//     req.user = user;
//     console.log("Token verified")
//     console.log("req.user", req.user)
//     next();
//   })

// }

import { createError } from './error.js';
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')


  console.log("verifying")
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      console.log("TOKEN VERIFIED")
      next();
    }
    catch (err) {
      console.log("error verifying token")
      res.json({
        message: "have not access"
      })
    }
  } else {
    console.log("error verifying token")
    res.json({
      message: "have not access"
    })
  }
}