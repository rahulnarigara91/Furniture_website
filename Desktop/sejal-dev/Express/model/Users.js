const mongoose = require('mongoose');
const validator = require ('validator');
const { encrypt }= require('../utils');
const AppError = require('../utils/AppError');


const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    contact:{
        type: Number,
        required: true
    },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
        
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: 6
    },
    con_pass:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    params: {
        type: Object
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }


})
// {
//     collection: 'users',
//     versionKey: false
// })

// encrypts password before saving
userSchema.pre('save', async function(next) {
    try {
        let password = this.password;
        let result = await encrypt(password);
        if(result !== null) {
            this.password = result;
        }
        else {
            next(new AppError(400, "Fail", "Password cannot be encrypted"));
        }
        
    } catch (error) {
        next(error);
    }
  })
  userSchema.pre('save', async function(next) {
    try {
        let con_pass = this.con_pass;
        let result = await encrypt(con_pass);
        if(result !== null) {
            this.con_pass = result;
        }
        else {
            next(new AppError(400, "Fail", "Confirm Password cannot be encrypted"));
        }
        
    } catch (error) {
        next(error);
    }
  })

  //if email id is in use
  userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new AppError(400, "Fail", "Email already in use"));
    } else {
      next(error);
    }
  });

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
  

//module.exports = {generatePasswordReset};
  
module.exports = mongoose.model('users', userSchema);


