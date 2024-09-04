const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');
const sharp =require('sharp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createToken = require('../utils/createToken')


const factoryHandler = require('./factoryHandler')
const {uploadSingleImage} = require('../middleWares/uploadImageMiddleware')
const ApiError = require('../utils/apiError')
const User = require("../models/userModel"); 



// upload Single Image
exports.uploadUserImage = uploadSingleImage('proFileImg')



// upload imge processing
exports.resizeImage = asyncHandler( async (req,res,next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
if(req.file){
   await  sharp(req.file.buffer)
   .resize(600,600)
   .toFormat("jpeg")
   .jpeg({quality:90})
   .toFile(`uploads/users/${filename}`)
   req.body.proFileImg = filename
}
next()
}
)

// @desc  get List of Users
// @route get /api/v1/users
// private


exports.getUsers = factoryHandler.getAll(User)

// @desc    get Specific user
// @route   get /api/v1/users
// private
exports.getOneUser = factoryHandler.getOneById(User)

// @desc   Create user
// @route  post /api/v1/users
// private
exports.createUser = factoryHandler.createOne(User)

// @desc   Update user
// @route  put /api/v1/users
// private
exports.updateUser = asyncHandler(async (req, res, next) => {
 

    const documents = await User.findByIdAndUpdate(
      req.params.id,
     {
        name: req.body.name,
        slug:req.body.slug,
        phone:req.body.phone,
        email:req.body.email,
        proFileImg:req.body.proFileImg,
        role:req.body.role,

     },
      { new: true }
    );
    if (!documents) {
      return next(new ApiError(`No documents for this id ${ req.params.id}`, 404));
    }
    res.status(200).json({ data: documents });
  }); 


  exports.changeUserPassword = asyncHandler(async (req, res, next) => {
 

    const documents = await User.findByIdAndUpdate(
      req.params.id,
     {
        password:await bcrypt.hash(req.body.password,12),
       passwordChangedAt:Date.now()

     },
      { new: true }
    );
    if (!documents) {
      return next(new ApiError(`No documents for this id ${ req.params.id}`, 404));
    }
    res.status(200).json({ data: documents });
  }); 
// @desc   Delete user
// @route  Delete /api/v1/users
// private
exports.deleteUser = factoryHandler.deleteOne(User)


// @desc Get logged user data
// @route  Delete /api/v1/users/getMe
// protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
req.params.id = req.user._id
next()
})

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});


// @desc    Update logged user Data
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {

const updateData = await User.findByIdAndUpdate(req.user._id,{
name:req.body.name,
email:req.body.email,
phone:req.body.phone,
},{ new: true})

res.status(200).json({data:updateData})
}
)


// @desc    Delete logged user Data
// @route   PUT /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id,{active:false})

  res.status(204).json({msg:'sucess'})

})

