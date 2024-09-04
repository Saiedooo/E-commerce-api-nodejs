const { check ,body } = require('express-validator');
const validatorMIddleware = require('../../middleWares/validatorMIddleware');
const { default: slugify } = require('slugify');





exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id'),
    validatorMIddleware
]


exports.createBrandValidator = [
    check('name')
    .notEmpty()
    .withMessage('Must be named')
    .isLength({min: 3})
    .withMessage("too short")
    .isLength({max: 32})
    .withMessage("too high")
    ,validatorMIddleware
]


exports.updateBrandValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid Brand id'),
    body('name').optional().custom((val ,{req})=>{
    req.body.slug = slugify(val)
  return true
    }),
    validatorMIddleware
]


exports.deleteBrandValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid Brand id'),
    validatorMIddleware
]