const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


const getConnect = async () =>{
    try{
       
        await mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("mongoose connected");
    }catch(error){
        console.log("mongoose is not connected",error);
       
    }
}

const closeConnection = ()=>{
    mongoose.connection.close();
}

module.exports = {getConnect,closeConnection};