module.exports.errorHandler=(req,res,err)=>{
    if(req.isEAS){return;}
    req.isEAS=true;
    if(typeof err.status==='undefined'){err.status=500;}
    res.statusCode=err.status;
    res.end(`
        {
            "error" : ${err.status},
            "message" : "${err.message}"
        }
    `);
}