const User=require('../models/user');
const Chat=require('../models/chat');
const Msg=require('../models/msg');

const isLoggedIn=require('../middleware/isLoggedIn');
const userInChat=require('../util/userInChat');
const chatOfUser=require('../util/chatOfUser');
const delChatMsg=require('../util/delChatMsg');

module.exports={
    getMsgInChat:async ({chatId},args)=>{
        // console.log(args);
        try {
            await isLoggedIn(args.req);
            const uic=await userInChat(chatId,args.req.userId);
            if(uic===false){
                throw new Error("You are not a part of this chat you cannot read message");
            }
            const chat=await Chat.findById(chatId);
            const msg=[];
            for(i in chat.msgs){
                const m=await Msg.findById(chat.msgs[i]).populate('sender');
                msg.push({
                    content:m.content,
                    senderEmail:m.sender.email,
                    isUser:(m.sender._id.toString()===args.req.userId.toString())
                });
            }
            return msg;
        } catch (error) {
            throw error;
        }
    },
    getYourChats:async (root,args,context,info)=>{
        try {
            await isLoggedIn(args.req);
            const user=await User.findById(args.req.userId);
            const chat=[];
            for(i in user.chats){
                chat.push(
                    await Chat.findById(user.chats[i])
                );
            }
            return chat;
        } catch (error) {
            throw error;
        }
    },
    getUsersInChat:async ({chatId},args)=>{
        try {
            await isLoggedIn(args.req);
            const chat=await Chat.findById(chatId);
            const users=[];
            for(i in chat.users){
                users
                .push(
                    await User.findById(
                        chat.users[i]
                    )
                );
            }
            return users;
        } catch (error) {
            throw error;
        }
    },
    createChat:async ({name},args)=>{
        try {
            await isLoggedIn(args.req);
            const chat=await Chat.create({
                name:name,
                users:[args.req.userId],
                msgs:[]
            });
            const user=await User.findById(args.req.userId);
            user.chats.push(chat._id);
            await user.save();
            return chat._id;
        } catch (error) {
            throw error;
        }
    },
    createMsg:async ({content,chatId},args)=>{
        try {
            await isLoggedIn(args.req);
            const chat=await Chat.findById(chatId);
            for(i in chat.users){
                if(chat.users[i].toString()===args.req.userId.toString()){
                    const msg=await Msg.create({
                        content:content,
                        sender:args.req.userId
                    });
                    chat.msgs.push(msg._id);
                    await chat.save();
                    return msg._id.toString();
                }
            }
            throw new Error("You are not part of this chat you cannot send message");
        } catch (error) {
            throw error;
        }
    },
    addUserToChat:async ({chatId,userId},args)=>{
        try {
            await isLoggedIn(args.req);
            const uic=await userInChat(chatId,args.req.userId);
            if(uic!==0){
                throw new Error("You are not Chat Administrator you cannot add a user");
            }
            const uinc=await userInChat(chatId,userId);
            if(typeof uinc==='number'){
                throw new Error("User already in Chat");
            }
            const chat=await Chat.findById(chatId);
            chat.users.push(userId);
            await chat.save();
            const user=await User.findById(userId);
            user.chats.push(chat._id);
            await user.save();
            return "added user to chat";
        } catch (error) {
            throw error;
        }
    },
    remChatMem:async ({chatId,userId},args)=>{
        try {
            await isLoggedIn(args.req);
            const uic=await userInChat(chatId,args.req.userId);
            if(uic!==0){
                throw new Error("You are not Chat Administrator you cannot remove a user");
            }
            const uinc=await userInChat(chatId,userId);
            if(uinc===false){
                throw new Error("User not in Chat");
            }
            const chat=await Chat.findById(chatId);
            chat.users.splice(uinc,1);
            await chat.save();
            if(chat.users.length===0){
                await delChatMsg(chatId);
                await Chat.findByIdAndDelete(chatId);
            }
            const cofu=await chatOfUser(chatId,userId);
            user.chats.splice(cofu,1);
            await user.save();
            return "done";
        } catch (error) {
            throw error;
        }
    },
    leaveChat:async ({chatId},args)=>{
        try {
            await isLoggedIn(args.req);
            const uinc=await userInChat(chatId,args.req.userId);
            if(uinc===false){
                throw new Error('You are not in Chat');
            }
            const cofu=await chatOfUser(chatId,args.req.userId);
            const user=await User.findById(args.req.userId);
            const chat=await Chat.findById(chatId);
            user.chats.splice(cofu,1);
            await user.save();
            if(chat.users.length===1){
                await delChatMsg(chatId);
                await Chat.findByIdAndDelete(chatId);
                return cofu;
            }
            else{
                chat.users.splice(uinc,1);
                await chat.save();
                return cofu;
            }
        } catch (error) {
            throw error;
        }
    }
}