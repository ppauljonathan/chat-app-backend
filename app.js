require('dotenv').config();
const http=require('http');
const mongoose=require('mongoose');

const {errorHandler}=require('./controllers/errors');
const {bodyParser}=require('./middleware/bodyParser');

const {graphql}=require('graphql');
const {schema}=require('./graphql/schema');
const root=require('./graphql/resolver');

const app=http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Content-Type','application/json');
    req.isEAS=false;
    req.on('error',(err)=>{errorHandler(req,res,err)});

    if(req.method.toLowerCase()==='options'){
        req.isEAS=true;
        res.statusCode=200;
        res.end();
    }

    if(req.method.toLowerCase()!=='post'){
        const err=new Error("Method not allowed");
        err.status=405;
        req.emit('error',err);
    }
    
    if(req.url.toLowerCase()!=='/'){
        const err=new Error("Endpoint does not exist on this server");
        err.status=404;
        req.emit('error',err);
    }

    bodyParser(req)
    .then(done=>{
        if(!req.isEAS){
            graphql(schema,req.body.query,root,{req:req})
            .then(result=>{
                if(!req.isEAS)
                    res.end(JSON.stringify(result));
            })
            .catch(err=>{
                if(!req.isEAS)
                    res.end(JSON.stringify(err));
            });
        }
    })
    .catch(err=>{
        err.status=400;
        req.emit('error',err);
    });
});

const {Server}=require('socket.io');
const io=new Server(app,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:true
    }
)
.then(done=>{
    console.log("DB connected");
    io.on('connection',(socket)=>{
        socket.on('msg-sent',(data)=>{
            socket.broadcast.emit('mfd',data);
        })
    })
    app.listen(process.env.PORT,()=>{
        console.log("server active on http://localhost:"+process.env.PORT);
    })
})
.catch(err=>{
    console.log("error connencting to db\n",err);
})