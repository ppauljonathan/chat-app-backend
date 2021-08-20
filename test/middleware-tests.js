const {}=require('chai');
const isLoggedIn=require('../middleware/isLoggedIn');
describe('isLoggedIn Test',function(){
    it('should throw error if Auth Header is not there',function(done){
        const req={
            headers:{
                a:"n"
            }
        }
        isLoggedIn(req)
        .then(result=>{
            console.log(result);
            done();
        })
        .catch(err=>{
            console.log(err);
            done(err);
        })
    })
})