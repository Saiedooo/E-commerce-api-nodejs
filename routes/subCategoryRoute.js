const express = require("express");

const {
  createSubCategory,
  getOneSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  createFilterObj,
  setCategoryIdToBody,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator ");

const router = express.Router({ mergeParams: true });

const authService = require("../services/authService");

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getOneSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
