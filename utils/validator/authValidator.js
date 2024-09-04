const { check ,body } = require('express-validator');
const validatorMIddleware = require('../../middleWares/validatorMIddleware');
const slugify  = require('slugify');

const User = require('../../models/userModel')



exports.signupValidator = [
    check('name')
    .notEmpty()
    .withMessage('Must be named')
    .isLength({min: 3})
    .withMessage("too short").
    custom((val ,{req})=>{
        req.body.slug = slugify(val)
      return true}),


      check('email').notEmpty().withMessage('email required').isEmail()
      .withMessage('invalid email adress').custom((val) => User.findOne({email:val}).then((user )=> {
        if(user){
            return Promise.reject( new Error('E-mail is already used'))
        }
      }
      )),


      check('password').notEmpty().withMessage('password Required')
      .isLength({min:6}).withMessage('password must be at 6 charecters')
      .custom((password, {req} ) => {
        if(password !== req.body.passwordConfirm){
            throw new Error('password Confimation InCorrect')

        }
        return true
      }),

      check('passwordConfirm').notEmpty().withMessage('password Confirm Required'),
      

      check('proFileImg').optional(),
      check('role').optional(),
    
    validatorMIddleware
]


exports.loginValidator = [
    check('email').notEmpty().withMessage('email required').isEmail()
    .withMessage('invalid email adress'),

    check('password').notEmpty().withMessage('password Required')
    .isLength({min:6}).withMessage('password must be at 6 charecters')
    
,

  validatorMIddleware
]

