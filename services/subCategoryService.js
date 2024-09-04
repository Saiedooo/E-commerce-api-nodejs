
const SubCategory = require("../models/subCategoryModel");
const factoryHandler = require('./factoryHandler')


exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};



// @desc  get All subCategories
// @route get /api/v1/subcategories

exports.getSubCategories = factoryHandler.getAll(SubCategory)
// @desc  get  subCategories By id
// @route get /api/v1/subcategories

exports.getOneSubCategory = factoryHandler.getOneById(SubCategory)

// @desc   Create subCategories
// @route  post /api/v1/subcategories

exports.createSubCategory = factoryHandler.createOne(SubCategory)
// @desc   update subCategories
// @route  post /api/v1/subcategories


exports.updateSubCategory = factoryHandler.updateOne(SubCategory)


// @desc   delete subCategories
// @route  post /api/v1/subcategories

exports.deleteSubCategory = factoryHandler.deleteOne(SubCategory)

