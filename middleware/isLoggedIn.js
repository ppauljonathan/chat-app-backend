require('dotenv').config();
const jwt=require('jsonwebtoken');

const User=require('../models/user');

module.exports=(req)=>{
    return new Promise(async (res,rej)=>{
        if(typeof req.headers.authorization==='undefined'){
            const err=new Error("Auth Header Not Provided");
            err.status=400;
            req.emit('error',err);
            rej("ERR");
            return;
        }
        if(req.headers.authorization.split(' ')[0]!=='Bearer'){
            const err=new Error("Auth Method should be with Bearer Token");
            err.status=400;
            req.emit('error',err);
            rej("ERR");
            return;
        }
        try {
            const token=jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET);
            const user=await User.findById(token.id);
            if(!user){throw new Error("User not Found may have been deleted");}
            req.userId=token.id;
            res("done");
        } catch (error) {
            rej(error);
        }
    })
}