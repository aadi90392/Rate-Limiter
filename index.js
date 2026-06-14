const express = require('express');
const app =  express();
const PORT = process.env.PORT || 3000;

const userRequests = new Map();
const ipRequest = new Map();

const Window_MS = 60* 1000;
const MAX_USER_REQS = 5;
const MAX_IP = 20;

const rateLimiter = (req,res,next)=>{
    const userId = req.headers['userid'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const now = Date.now();

    if(!userId){
        return res.status(400).json({error: "User id Is Missing in the header"});
    }
        const cleanOldRequest = (timestamps)=> timestamps.filter(time => now - time < Window_MS);
        let ipTimes = ipRequest.get(ip) || [];
        ipTimes = cleanOldRequest(ipTimes);
    

        if(ipTimes.length>= MAX_IP){
            return res.status(429).json({
                error: "Too many request"
            });
        }
        let userTimes = userRequests.get(userId)|| [];
        userTimes = cleanOldRequest(userTimes);
        if(userTimes.length>=MAX_USER_REQS){
            return res.status(429).json({
                error: "Too Many request"
            })
        }
        ipTimes.push(now);
        ipRequest.set(ip,ipTimes);

       

        userTimes.push(now);
        userRequests.set(userId, userTimes);

        next();
    };


    app.get('/data',rateLimiter, (req,res)=>{
        res.status(200).json({
            success: true,
            message: "request Successful",
            timestamps: new Date().toISOString()
        });
    });
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});


