const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const msgSchema=new Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String
    }
},
{
    timestamps:true
    
});

module.exports=mongoose.model('msg',msgSchema);