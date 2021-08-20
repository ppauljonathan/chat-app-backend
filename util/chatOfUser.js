const User=require('../models/user');

module.exports=(chatId,userId)=>{
    return new Promise(async (res,rej)=>{
        try {
            const user=await User.findById(userId);
            if(user===null){
                rej("User not found may have been deleted");
            }
            const index=user.chats.findIndex(
                (c)=>{
                    return c.toString()===chatId.toString();
                }
            );
            if(index===-1){res(false);return;}
            res(index);
        } catch (error) {
            rej(error);
        }
    });
}