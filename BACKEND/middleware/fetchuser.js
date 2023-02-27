// middleware jo hai hum '/getuser',async (req , res) k beech m daal dete hain async function chlne se pehle yeh midleware function chll jaaye or user mill jaaye token m se

const jwt = require('jsonwebtoken'); 
const JWT_SECTRET = "shubhamisagoodbpy@1" ; 

const fetchuser = (req , res , next) => {
    const token = req.header('auth-token');
    // yeh header hum headers m daalengey thunder client k andar or isme token dengey 
    if(!token){
        res.status(401).send({error : "Please authenticate using a valid token"})
    }
    try {
        // data k andar vo data aa jeyga jo hmne user k andar bheja tha 
        const data =  jwt.verify(token , JWT_SECTRET)
        req.user = data.user 
        next()
    } catch (error) {
        res.status(401).send({error : "Please authenticate using a valid token"})
    }
}

module.exports = fetchuser