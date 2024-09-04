const { validationResult } = require('express-validator');

const validatorMiddleware = (req,res,next)  =>{
const errors = validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json(errors.array())
    
}
 next() // why next because if not error go to handler getoneCategory
}

module.exports = validatorMiddleware