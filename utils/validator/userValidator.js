const { check ,body } = require('express-validator');
const validatorMIddleware = require('../../middleWares/validatorMIddleware');
const slugify  = require('slugify');
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')



exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'),
    validatorMIddleware
]


exports.createUserValidator = [
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
      
      check('phone').optional().isMobilePhone(['ar-EG','ar-SA']).withMessage('invalid phone number only accepted egy and saudi number'),


      check('proFileImg').optional(),
      check('role').optional(),
    
    validatorMIddleware
]


exports.updateUserValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid User id'),
    body('name').optional().custom((val ,{req})=>{
    req.body.slug = slugify(val)
  return true
    }),
    check('email').notEmpty().withMessage('email required').isEmail()
    .withMessage('invalid email adress').custom((val) => User.findOne({email:val}).then((user )=> {
      if(user){
          return Promise.reject( new Error('E-mail is already used'))
      }
    }
    )),
      
    check('phone')
    .optional()
    .isMobilePhone(['ar-EG','ar-SA'])
    .withMessage('invalid phone number only accepted egy and saudi number'),


    check('proFileImg').optional(),
    check('role').optional()

    // check('password').isLength({min:6}).withMessage('password must be over 6 charecter')
    ,
    validatorMIddleware
]
exports.changeUserPasswordValidator = [
  check('id')
  .isMongoId()
  .withMessage('Invalid User id'),

  check('currentPassword')
  .notEmpty()
  .withMessage('current Password is required'),

  check('passwordConfirm')
  .notEmpty()
  .withMessage('You Must Enter the password Confirm'),

  check('password')
  .notEmpty()
  .withMessage('You Must Enter New password').custom(async(val,{req})=>{
    // verfiy current password
    const user = await User.findById(req.params.id)
    if(!user) {
      throw new Error('there is no user for this id')
    }
    const isComparePassword  = await bcrypt.compare(req.body.currentPassword,user.password)
    
     if(!isComparePassword ){
      throw new Error('Incorrect Current Password')
     }
      // verify confirmPassword
      if(val !== req.body.passwordConfirm){
        throw new Error('password Confimation InCorrect')}

        return true
  }),
  validatorMIddleware
]

exports.deleteUserValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid User id'),
    validatorMIddleware
]




exports.updateUserLoggedValidator =[
  check('id')
  .isMongoId()
  .withMessage('Invalid User id'),
  body('name').optional().custom((val ,{req})=>{
  req.body.slug = slugify(val)
return true
  }),
  check('email').notEmpty().withMessage('email required').isEmail()
  .withMessage('invalid email adress').custom((val) => User.findOne({email:val}).then((user )=> {
    if(user){
        return Promise.reject( new Error('E-mail is already used'))
    }
  }
  )),
    
  check('phone')
  .optional()
  .isMobilePhone(['ar-EG','ar-SA'])
  .withMessage('invalid phone number only accepted egy and saudi number')
  ,
  validatorMIddleware
]