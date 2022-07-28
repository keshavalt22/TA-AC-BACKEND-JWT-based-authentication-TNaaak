let jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req, res, next) => {
        var token =  req.headers.authorization;
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
        
    },
    authorizeOptional: async (req, res, next) => {
        let token = req.headers.authorization;
        try {
          if (token) {
            let payload = await jwt.verify(token, process.env.SECRET);
            req.user = payload;
            return next();
          } else {
            return next();
          }
        } catch (error) {
          next(error);
        }
    }
}

