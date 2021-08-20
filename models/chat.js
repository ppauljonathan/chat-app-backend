const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const chatSchema=new Schema({
    name:{
        type:String,
        req:true
    },
    users:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    msgs:[{
        type:mongoose.Types.ObjectId,
        ref:'msg'
    }]
},
{
    timestamps:true
});

module.exports=mongoose.model('chat',chatSchema);