const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');
const sharp =require('sharp')

const factoryHandler = require('./factoryHandler')
const {uploadSingleImage} = require('../middleWares/uploadImageMiddleware')
const Brand = require("../models/brandModel"); 



// upload Single Image
exports.uploadBrandImage = uploadSingleImage('image')



// upload imge processing
exports.resizeImage = asyncHandler( async (req,res,next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`

 await  sharp(req.file.buffer)
   .resize(600,600)
   .toFormat("jpeg")
   .jpeg({quality:90})
   .toFile(`uploads/brands/${filename}`)
   req.body.image = filename
   next()
})

// @desc  get All Categories
// @route get /api/v1/categories



exports.getBrand = factoryHandler.getAll(Brand)

// @desc    get Specific Categories
// @route   get /api/v1/categories

exports.getOneBrand = factoryHandler.getOneById(Brand)

// @desc   Create Categories
// @route  post /api/v1/categories

exports.createBrand = factoryHandler.createOne(Brand)

// @desc   Update Categories
// @route  put /api/v1/categories

exports.updateBrand = factoryHandler.updateOne(Brand)

// @desc   Delete Categories
// @route  Delete /api/v1/categories

exports.deleteBrand = factoryHandler.deleteOne(Brand)

