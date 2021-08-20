const Chat=require('../models/chat');

module.exports=(chatId,userId)=>{
    return new Promise(async (res,rej)=>{
        try {
            const chat=await Chat.findById(chatId);
            if(chat===null){
                rej("Chat not found may have been deleted");
            }
            const index=chat.users.findIndex(
                (u)=>{
                    return u.toString()===userId.toString();
                }
            );
            if(index===-1){res(false);}
            res(index);
        } catch (error) {
            rej(error);   
        }
    })
}