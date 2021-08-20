module.exports.bodyParser=(req)=>{
    let body='';
    return new Promise((res,rej)=>{
        req.on('bodyMade',()=>{
            if(req.headers['content-type']=='application/json'){
                req.body=JSON.parse(body);
            }
            else{
                const error=new Error("content-type header should be application/json");
                error.status=400;
                req.emit('error',error)
            }
            return res("done");
        })
        req.on('data',(ch)=>{
            body+=ch.toString();
            req.emit('bodyMade');
        })
        res("no data");
    })
}