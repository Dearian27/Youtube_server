import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const verifyToken = (req, res, next) => {

    console.log(req.cookies);
    console.log(req.cookies.access_token ? req.cookies.access_token : "HAVE NOT ACCESS_TOKEN");

    const token = req.cookies.access_token;
    if (!token) return next(createError(401, "You are not authenticated"));
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, "Token verification failed"));
    req.user = user;
    console.log("req.user", req.user)
    next();
  })
}

// import { createError } from './error.js';
// import jwt from 'jsonwebtoken'

// export const verifyToken = (req, res, next) => {
//   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  
//   console.log(req.headers.authorization)
//   console.log("verifying", token ? token : "not have a token")

//   if (token) {
//     try {
//       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
//       console.log(decodedToken, 'token decoded')
//       req.user = decodedToken;
//       console.log('user', req.user)
//       console.log("TOKEN VERIFIED")
//       next();
//     }
//     catch (err) {
//       console.log("error verifying token")
//       res.json({
//         message: "have not access"
//       })
//     }
//   } else {
//     console.log("error verifying token")
//     res.json({
//       message: "have not access"
//     })
//   }
// }