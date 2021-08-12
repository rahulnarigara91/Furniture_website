const nJwt = require('njwt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils/constant');
const Users = require('../model/Users');
const AppError = require('../utils/AppError');

//needs auth token to access protected routes, x-auth-token
const protect = async (request, response, next) => {
    try {
        const token = request.header('x-auth-token');
        if(!token) {
            return next(new AppError(400, "Fail", "No Token present"), request, response, next);
        }
        let result = await nJwt.verify(token, secretKey);
        if(result) {
            const userId = result.body.id;
            let userDetails = await Users.findOne({_id: userId});
            request.user = userDetails;
            next();
        }
        else {
            return next(new AppError(401, "Fail", "Token Expired"), request, response, next);
        }
        
    } catch (error) {
        next(error);
    }
};



// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     console.log(token);
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  
//     const userId = decodedToken.userId;
//     if (req.body.userId && req.body.userId !== userId) {
//       throw 'Invalid user ID';
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };

module.exports = protect;   
//module.exports = authController;
