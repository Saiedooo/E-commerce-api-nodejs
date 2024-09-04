const { check,body } = require('express-validator');
const validatorMIddleware = require('../../middleWares/validatorMIddleware')
const slugify = require("slugify");






exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMIddleware
]


exports.createCategoryValidator = [
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
    ,validatorMIddleware
]


exports.updateCategoryValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid Category id'),
    body("name").optional().custom((val ,{req})=>{
        req.body.slug = slugify(val)
        return true
        }),

    validatorMIddleware
]


exports.deleteCategoryValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid Category id'),
    validatorMIddleware
]