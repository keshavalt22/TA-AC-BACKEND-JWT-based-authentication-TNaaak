let jwt = require('jsonwebtoken');
const { token } = require('morgan');

module.exports = {
    verifyToken: async(req, res, next) => {
        try {
            if(token) {
                var payload = await jwt.verify(token, process.env.SECRET);
                req.user = payload;
                return next();
            } else {
                res.status(400).json({error: "Token Required"});
            } 
        } catch (error) {
           next(error); 
        }
    }
}