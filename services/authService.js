const crypto = require('crypto')
require('dotenv').config();
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const sendEmail = require('../utils/sendEmail')

const createToken = require('../utils/createToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')



// @desc Signup 
// @route Post /api/v1/auth/signup
// @acces public

exports.signup = asyncHandler(async (req,res,next ) => {
// create User
const user = await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
})
// generate Token
const token = createToken(user._id)

res.status(201).json({data:user,token})

})
// @desc Login 
// @route Post /api/v1/auth/login
// @acces public
exports.login = asyncHandler(async (req,res,next) => {
// check if user exsit & check if password is correct
const user = await User.findOne({email:req.body.email})
if(!user || !await bcrypt.compare(req.body.password,user.password) ) {
  return next(new ApiError('Incorrect Email Or password ',401))
}
// generate Token
const token = createToken(user._id)
//   send Response
res.status(201).json({data:user,token})
})

// @desc Signup 
// @route Post /api/v1/auth/signup
// @acces public

exports.protect = asyncHandler(async(req,res,next) => {
    // 1) cheeck if token exist if exist hold it
     //console.log(req.headers);  // headers in hidden postman
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization.split(' ')[1]
        // console.log(token);
    }
    if(!token){
        return next(new ApiError('you are not login , Please login to get acces this route  ',401))
    }


    // 2)verify token (no change happen ,expired token)
  const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY) //return decoded cl decded
//   console.log(decoded);

    // 3)check if user exists

   const currentUser = await User.findById(decoded.userId) 
   if(!currentUser){
    return next(new ApiError('the user that belong to token does not longer Exist',401))
   }

    // 4)check if user change his password after token created
    if(currentUser.passwordChangedAt){
  
        const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getDate()/1000,10)
        if(passwordChangedTimestamp > decoded.iat){
            return next(new ApiError('User recently changed password plz login again',401))
        }

    }
    req.user = currentUser
    next()
})

// @desc authorization
exports.allowedTo = (...roles)=> asyncHandler(async(req,res,next)=> {

if(!roles.includes(req.user.role)){
    next(new ApiError('You are not allowed to access this route', 403))
}
next()
})


// @desc Forget Password 
// @route Post /api/v1/auth/forgotPassword
// @acces public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${req.body.email}`, 404)
      );
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
  
    await user.save();
  
    // 3) Send the reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try{
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });
  
    }catch(err){
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
  
       await user.save()
       return next(new ApiError('There is an error in sending email', 500));
    }
     
    res
      .status(200)
      .json({ status: 'Success', message: 'Reset code sent to email' });
  });


// @desc verify Password Reset code
// @route Post /api/v1/auth/verifyResetCode
// @acces public
  exports.verifyPasswordResetCode = asyncHandler(async(req,res,next) => {
   const hashshedResetCode = crypto
   .createHash('sha256')
   .update(req.body.resetCode)
   .digest('hex');
  
    const user = await User.findOne({passwordResetCode : hashshedResetCode,
      passwordResetExpires:{$gt: Date.now()}
    })
  if(!user){
    return next(new ApiError("Reset code invalid or expired"))
  }
  // send response
  user.passwordResetVerified  = true
  await user.save()
  res.status(200).json({
    status: 'Succes'
  })
  })

// @desc Reset Password  
// @route Post /api/v1/auth/resetPassword
// @acces public
  exports.resetPassword = asyncHandler(async(req,res,next)=>{
    // get user based on email
    const user = await User.findOne({email:req.body.email})
   if (!user){
      return next(new ApiError(`there is no user for this email ${req.body.email}`,404))
    }
    // check if reset code verified
    if(!user.passwordResetVerified){
      return next(new ApiError('there is no user reset code not verified ',404))
    }
    user.password = req.body.newPassword
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save()

    // 3) should generate new token 
    const token = createToken(user._id)
    res.status(200).json({token})
  })