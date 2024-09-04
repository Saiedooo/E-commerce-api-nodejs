
const sharp =require('sharp')

const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');
const factoryHandler = require('./factoryHandler')

const {uploadMixOfImages} = require('../middleWares/uploadImageMiddleware')

const Product = require("../models/productModel");


exports.uploadProductImages = uploadMixOfImages([{
    name:"imageCover",
    maxCount:1
},{
    name:'images',
    maxCount:5
}])

exports.resizeProductImages =asyncHandler(async (req,res,next) => {
    // image Processing for imagecover 
if(req.files.imageCover){
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
    await  sharp(req.files.imageCover[0].buffer) //consolelog req.files we have array need element 1
      .resize(2000,1333)
      .toFormat("jpeg")
      .jpeg({quality:95})
      .toFile(`uploads/products/${imageCoverFilename}`)
      req.body.imageCover = imageCoverFilename
      
} 
// image processing for images
if(req.files.images){
    req.body.images = []
    await Promise.all(

    req.files.images.map(async(img,index)=> {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
        
                await sharp(img.buffer)
                .resize(600,300)
                .toFormat("jpeg")
                .jpeg({quality:90})
                .toFile(`uploads/products/${imageName}`)
                req.body.images.push(imageName)
        
            })

    
)
    next()
}

})
// @desc  get All products
// @route get /api/v1/products

exports.getProducts = factoryHandler.getAll(Product,'products')

// @desc    get Specific product
// @route   get /api/v1/products

exports.getOneProduct = factoryHandler.getOneById(Product)

// @desc   Create product
// @route  post /api/v1/products

exports.createProduct = factoryHandler.createOne(Product)

// @desc   Update Product
// @route  put /api/v1/Products

exports.updateProduct = factoryHandler.updateOne(Product)

// @desc   Delete Product
// @route  Delete /api/v1/Products

exports.deleteProduct = factoryHandler.deleteOne(Product)


