const mongoose = require("mongoose");
const validator = require("validator");
const {status,type} = require('../utils/constant')

const productSchema = new mongoose.Schema({

  name:{
    type:String
    //required: [true, "Please enter your name"]
},
discription:{
    type:String
    //required: [true, "Please enter your discription"]
},
type:{
    electronic:{
        type:String
    },
    fooditem:{
        type:String
    },
    clothing:{
        type:String
    }

},
status:{
    type:String,
    default:'PENDING'
},
createdAt:{
    type:Date,
    default:Date.now()
},
updatedAt:{
    type:Date,
    default:Date.now()
},
token: { type: String },
createdBy: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
},
updatedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
},

});

module.exports = mongoose.model("Product", productSchema);
