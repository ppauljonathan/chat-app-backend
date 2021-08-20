const Chat=require('../models/chat');
const Msg=require('../models/msg');

module.exports=(chatId)=>{
    return new Promise(async (res,rej)=>{
        try {
            const chat=await Chat.findById(chatId);
            if(chat==null){
                rej("Chat not found may have been deleted");
            }
            while(chat.msgs.length!=0){
                await Msg.findByIdAndDelete(chat.msgs[0]);
                chat.msgs.shift();
                await chat.save();
            }
            res("done");
        } catch (error) {
            rej(error);
        }
    })
}