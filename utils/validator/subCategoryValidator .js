const { check,body } = require('express-validator');
const slugify = require("slugify");

const validatorMIddleware = require('../../middleWares/validatorMIddleware')





exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory id'),
    validatorMIddleware
]


exports.createSubCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('Must be named')
    .isLength({min: 3})
    .withMessage("too short")
    .isLength({max: 32})
    .withMessage("too high").custom((val ,{req})=>{
        req.body.slug = slugify(val)
      return true
    })
    ,check('category')
    .notEmpty()
    .withMessage('Sub category must be belong to category')
    .isMongoId().withMessage('Invalid Category id')
  
    ,validatorMIddleware
]


exports.updateSubCategoryValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory id'),
    body('name').custom((val ,{req})=>{
        req.body.slug = slugify(val)
      return true
    })
    ,validatorMIddleware
]


exports.deleteSubCategoryValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory id'),
    validatorMIddleware
]