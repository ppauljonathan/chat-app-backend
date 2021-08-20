require('dotenv').config();
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt=require('jsonwebtoken');

const User=require('../models/user');

const isLoggedIn=require('../middleware/isLoggedIn');

module.exports={
    getAllUsers:async (root,args,context,info)=>{
        try {
            await isLoggedIn(args.req);
            const users=await User.find();
            return users;
        } catch (error) {
            throw error;
        }
    },
    signup:async ({email,password})=>{
        try {
            if(!validator.isEmail(email)){throw new Error("Email not in proper format");}
            const hashedPwd=await bcrypt.hash(password,10);
            const alreadyUser=await User.findOne({email:email});
            if(alreadyUser){throw new Error("Email Already Taken");}
            await User.create({
                email:email,
                password:hashedPwd,
                chats:[]
            })
            return "created user";
        } catch (error) {
            throw error;
        }
    },
    login:async ({email,password})=>{
        try {
            const user=await User.findOne({email:email});
            if(!user){
                const err=new Error("User Not found try signing up");
                err.status=404;
                throw err;
            }
            const res=await bcrypt.compare(password,user.password);
            if(!res){
                const err=new Error("Password incorrect");
                err.status=401;
                throw err;
            }
            return jwt.sign(
                {
                    id:user._id.toString()
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'1h'
                }
            );
        } catch (error) {
            throw error;
        }
    },
    deleteAccount:async (root,args,context,info)=>{
        try {
            await isLoggedIn(args.req);
            const user=await User.findById(args.req.userId);
            if(user.chats.length>0){
                throw new Error("exit all your chats first to delete account");
            }
            await User.findByIdAndDelete(args.req.userId);
            return "deleted user";
        } catch (error) {
            throw error;
        }
    }
}