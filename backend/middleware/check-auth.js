const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    //in case no header
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'purpleTenDogWatch');
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "authorization failed"
        })
    }

    
}

