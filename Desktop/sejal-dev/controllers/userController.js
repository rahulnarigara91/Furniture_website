const Users = require("../model/Users");
const bcrypt = require ('bcrypt');
const _ = require('underscore');
const moment = require('moment');
const {status,type,myEmail,baseUrl} = require('../utils/constant');
const { getSuccessMessage,generateRandomOtp,generateRandomString,getJwtToken} = require('../utils');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendgrid');
const dotenv = require('dotenv').config();



// Get All users

const all_user = async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
      } catch (error) {
        res.json({ message: error });
      }
};

// Single user
const user_details = async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId);
        res.json(user);
      } catch (error) {
        res.json({ message: error });
      }
};


// Update user
const user_update = async (req, res) => {
    try {
        const users = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            contact: req.body.contact,
            email: req.body.email,
            password: req.body.password,
            con_pass: req.body.con_pass,
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt
        };
    
        const updatedUser = await Users.findByIdAndUpdate(
          { _id: req.params.userId },
          users
        );
        res.json(updatedUser);
      } catch (error) {
        res.json({ message: error });
      }
};

// Delete user
const user_delete = async (req, res) => {
    try {
        const removeUser = await Users.findByIdAndDelete(req.params.userId);
        res.json(removeUser);
      } catch (error) {
        res.json({ message: error });
      }
};

// Add New user //registration

const user_create = async (req, res) => {
  const users = new Users({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      contact: req.body.contact,
      email: req.body.email,
      password: req.body.password,
      con_pass: req.body.con_pass,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
     });
  
    try {
      const savedUser = await users.save();
      res.send(savedUser);
      let params = generateRandomOtp();
      //response.status(201).json(getSuccessMessage("User created"));
      
      //sendmail
  
      let emailParams = {
            to: myEmail,
            from: myEmail,
            params: {
              firstname: users.firstname,
                //otpVerification: params.token
            },
            templateName: "user.register"
          }
      
      console.log('emailParams: ', emailParams);
      sendEmail(emailParams);
    } catch (error) {
      // res.send(error);
      console.log(error);
    }
};



//login

const login = async (request, response, next) => {
  try {
      // check email
      let user = await Users.findOne({email: request.body.email}, 'email password verifiedEmail');
      if(user !== null) {
          // check password
          let match = await bcrypt.compare(request.body.password, user.password);

          if(match) {
            // create auth token
            let authToken = getJwtToken({id: user._id});
            //console.log("token:",authToken)

            // check whether email verified or not
            if(user) {
             
                return response.status(200).json(getSuccessMessage("Login successful",authToken));
                
            }
            else {
                next(new AppError(400, "Fail", "Please verify your email"));    
            }

        }
        else {
            next(new AppError(400, "Fail", "Incorrect Password"));
        }
    }
    else {
        next(new AppError(400, "Fail", "Incorrect Email"));
    }
      //     if(!match) {
      //       return response.status(400).json(getSuccessMessage("password incorrect"));
               
      //   }
      //     else {
      //         return response.status(200).json(getSuccessMessage("Login successful"));
      //     }
      // }
      // else {
      //   return response.status(400).json(getSuccessMessage("email is incorrect"));
      // }

  } catch(error) {
      next(error);
  }
}

//forgot password

const forgotPassword = async (request, response, next) => {
  try {
      // 1. get email and check if it exists
      let user = await Users.findOne({email: request.body.email}, 'email userProfile');
      
      // 2. if exists, generate a random string and pass it as token 
      //          -> which expires in 30 mins from its generation
      console.log("user: ", user);

      if(!_.isEmpty(user)) {
        //var authToken = getJwtToken({id: user._id});

          let params = generateRandomString();
          // 3. save params in db along with users, add a flag for verification
          let updatedUser = await Users.findOneAndUpdate({_id: user._id}, {params}, {new: true});
          console.log('updatedUser: ', updatedUser);

          if(updatedUser == null) {
              next(new AppError(400, "Fail", "User not updated"), request, response, next);
          }
          //userName = user.userProfile.firstName || user.email.split('@')[0];
 
          // 4. send mail with token as url
          let emailParams = {
              to: user.email,
              from: myEmail,
              params: {
                firstname: user.firstname,
                  forgotPasswordUrl: `${baseUrl}reset-password?token=${params.token}`,
                 
              },
              templateName: "user.forgot.password"
          }
          sendEmail(emailParams);
          //console.log('token: ', authToken);

          return response.status(200).json(getSuccessMessage("Mail sent!"));
      
      }
      else {
          next(new AppError(400, "Fail", "Email does not exist"));
      }
      

  } catch (error) {
      next(error);
  }
}

//reset password


const resetPassword = async (request, response, next) => {
  
  try {
      // 1. check if password and confirm password are same
      let { password, con_pass,token } = request.body;
      console.log('password, con_pass: ', password, con_pass);
      //let token = request.params.token;
      console.log('token: ', token);
      if(password === con_pass) {
       

          // 3. find user and check expiry using url param token
          let user = await Users.findOne({"params.token": token}, 'params.expiryTime');
          console.log('user: ', user);
          if(user) {
            //var authToken = getJwtToken({id: user._id});
              // the time when it expires is greater than current time
              
              if(user.params.expiryTime > moment(Date.now())) {
               
                  // 5. replace encrypted password
                  let updatedUser = await Users.findOneAndUpdate({_id: user._id}, {con_pass}, {new: true});
                  console.log('updatedUser: ', updatedUser);
                  if(updatedUser) {
                      // 6. password reset successful
                      response.status(200).json(getSuccessMessage("Password reset successful"));
                  }
                  else {
                      next(new AppError(400, "Fails", "Could not reset password"));
                  }
              }
              else {
                  // 4. if expired -> Password cannot be reset (resend reset password link)
                  next(new AppError(400, "Fails", "Reset password link expired"));
              }
          }
          else {
              next(new AppError(400, "Fails", "User not found"));
          }
      
      }    
      // 2. if not, throw error -> Passwords do not match
      else {
          next(new AppError(400, "Fail", "Passwords do not match"), request, response, next);
      }
  
  } catch (error) {
      next(error);
  }
}

exports.emailVerification = async (request, response, next) => {
  // 1. fetch token from url params and check if the corresponding user exists
  let otp = request.body.otp;
  let user = await Users.findOne({$or: [{"params.token": otp}, {verifiedEmail: true}]}, 'params.expiryTime verifiedEmail');

  console.log('user: ', user);
  
  if(user) {    
      // 2. if "verifiedEmail" is true, already verified
      if(user.verifiedEmail) {
          next(new AppError(400, "Fails", "Email Verification already done"));
      }
      // 3. if "verifiedEmail" is false -> make it true
      else {
          // 4. check expiryTime
          if(user.params.expiryTime > moment(Date.now())) {
              // update verifiedEmail = true and remove params {token, expiryTime}
              let updatedUser = await Users.findOneAndUpdate({"params.token": otp}, {$set:{verifiedEmail: true}, $unset: {params: {}}}, {new: true});
              if(updatedUser) {
                  return response.status(200).json(getSuccessMessage("Email verified"));
              }
              else {
                  next(new AppError(400, "Fails", "User could not be verified"));
              }
          }
          else {
              // 4. if expired -> link expired
              next(new AppError(400, "Fails", "Verification link expired"));
          }
      }
  }
  // 2. if not, user does not exist
  else {
      next(new AppError(400, "Fails", "User does not exist"));
  }
}


exports.resendEmailVerification = async (request, response, next) => {
  // 1. check if the corresponding user exists
  let email = request.body.email;
  let user = await Users.findOne({$or: [{email}, {verifiedEmail: true}]}, 'params.expiryTime verifiedEmail');
  console.log('user: ', user);
  if(user) {    
      // 2. if "verifiedEmail" is true, already verified
      if(user.verifiedEmail) {
          next(new AppError(400, "Fails", "Email Verification already done"));
      }
      // 3. if "verifiedEmail" is false -> resend email
      else {
          let params = generateRandomOtp();
          
          // send mail
          let userName = email.split('@')[0];
          console.log('userName: ', userName);
          
          let emailParams = {
              to: myEmail,
              from: myEmail,
              params: {
                  userName,
                  otpVerification: params.token
              },
              templateName: "otp-registration"
          }
          sendMail(emailParams);
          return response.status(200).json(getSuccessMessage("Email verification link sent"));
      }
  }
  // 4. User does not exist
  else {
      next(new AppError(400, "Fails", "User does not exist"));
  }
}



exports.sendEmail = async (request, response, next) => {
  try {
      // createTemplate();
      sendEmail(request.body);
      
  } catch (error) {
      console.log(error);
  }
}


module.exports = {
    all_user, 
    user_details, 
    user_create, 
    user_update , 
    user_delete,
    login,
    forgotPassword,
    resetPassword
  
    //signup
    
  }
