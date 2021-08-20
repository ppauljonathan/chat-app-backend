# Chat App Backend
made with node.js+graphql

variables to use in /.env
```
PORT=<port to serve app>
MONGO_URI=<mongodb connection string>
JWT_SECRET=<jsonwebtoken secret>
```

API accepts only POST request to /

uses jwt for authorization

so request.headers.authorization property should be like
 'Bearer "jwt token"'

 when sending requests
 the post body should have graphql queries in the query feild

 ```
 req:{
     body:{
         query:`graphql query`
     }
 }
 ```

 list of queries and mutations
 ```
 Query{
        getMsgInChat(chatId:String!):[Msg]!
        getAllUsers:[User]!
        getYourChats:[Chat]!
    }

Mutation{
        signup(email:String!,password:String!):String!
        login(email:String!,password:String!):String!
        createChat(name:String!):String!
        createMsg(content:String!,chatId:String!):String!
        addUserToChat(chatId:String!,userId:String!):String!
        remChatMem(chatId:String!,userId:String!):String!
        leaveChat(chatId:String!):String!
        deleteAccount:String!

    }    

 ```