const {buildSchema}=require('graphql');

module.exports.schema=buildSchema(`
    type Msg{
        content:String!
        senderEmail:String!
        isUser:Boolean!
    }

    type User{
        email:String!
        id:String!
    }

    type Chat{
        name:String!
        id:String!
    }

    type Query{
        getMsgInChat(chatId:String!):[Msg]!
        getAllUsers:[User]!
        getYourChats:[Chat]!
        getUsersInChat(chatId:String!):[User]!
    }

    type Mutation{
        signup(email:String!,password:String!):String!
        login(email:String!,password:String!):String!
        createChat(name:String!):String!
        createMsg(content:String!,chatId:String!):String!
        addUserToChat(chatId:String!,userId:String!):String!
        remChatMem(chatId:String!,userId:String!):String!
        leaveChat(chatId:String!):Int!
        deleteAccount:String!

    }
`);