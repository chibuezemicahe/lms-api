const {validationResult} = require('express-validator');
        

const validationMiddleware = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: errors.array(),
        });
    }
 next();   
}

module.exports = {validationMiddleware};