const jwt = require('jsonwebtoken');

const jwt_secret= "abc@#$%&123456";

function providerAuthMiddleware(req,res,next){
    if(!req.headers.authorization){
        return res.json({error:true, message:'Please SignIn First!!'});
        }

        try {
            const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, jwt_secret);
            req.providerInfo = data;
            console.log(req.providerInfo)
            next();
        } catch (e) {
            return res.json({error:true, message:e.message});
        }
    }
    module.exports = {providerAuthMiddleware};