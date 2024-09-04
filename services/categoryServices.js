
const sharp =require('sharp')
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler')


const factoryHandler = require('./factoryHandler');
const {uploadSingleImage} = require('../middleWares/uploadImageMiddleware')
const CategoryModel = require("../models/categoryModels")


// upload Single Image
// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});


// @desc  get All Categories 
// @route get /api/v1/categories

exports.getCategories = factoryHandler.getAll(CategoryModel)
// @desc    get Specific Categories 
// @route   get /api/v1/categories

exports.getOneCategory = factoryHandler.getOneById(CategoryModel)


// @desc   Create Categories 
// @route  post /api/v1/categories

exports.createCategory = factoryHandler.createOne(CategoryModel)

// @desc   Update Categories 
// @route  put /api/v1/categories

exports.updateCategory = factoryHandler.updateOne(CategoryModel)

// @desc   Delete Categories 
// @route  Delete /api/v1/categories


exports.deleteCategory = factoryHandler.deleteOne(CategoryModel)

