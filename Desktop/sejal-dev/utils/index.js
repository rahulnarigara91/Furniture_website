const bcrypt = require('bcrypt');
const nJwt = require('njwt');
const moment = require('moment');
const { secretKey } = require('./constant');

const encrypt = async (password) => {
    try {
        let salt = await bcrypt.genSalt(3);
        let hash = await bcrypt.hash(password, salt);
        return hash;
        
    } catch (error) {
        return null;
    }
}

const getSuccessMessage = (message, data) => {
    return {
        message,
        data
    }
}

const getJwtToken = (data) => {
 
    let jwt = nJwt.create(data, secretKey);
    jwt.setExpiration(new Date().getTime() + (3 * 60 * 1000)); // 2 * 60
    return jwt.compact();
   
}

const generateRandomString = () => {
	let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	let string_length = 35;
	let randomstring = '';
	for (let i=0; i<string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
    }
    return {  //moment
        token: randomstring,
        expiryTime: moment(Date.now()).add(30, 'm')
    };
}

const generateRandomOtp = () => {
	let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	let string_length = 7;
	let randomstring = '';
	for (let i=0; i<string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
    }
    return {
        token: randomstring,
        expiryTime: moment(Date.now()).add(30, 'm')
    };
}


module.exports = {encrypt,getSuccessMessage,getJwtToken,generateRandomString,generateRandomOtp};