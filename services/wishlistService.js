const asyncHandler = require('express-async-handler')
const User = require("../models/userModel"); 




// @desc  Add product to wishlist
// @route get /api/v1/wishlist
// @acces private/user
exports.addProductToWishlist = asyncHandler(async (req,res,next) => {
    const user = await User.findByIdAndUpdate(req.user._id,{
        $addToSet:{whishlist: req.body.productId}
    },{new:true})

    res.status(200).json({status: 'success',message:'product Added Successfully To Your WishList',data:user.whishlist})
})

// @desc  remove product from wishlist
// @route delete /api/v1/wishlist/productId
// @acces private/user
exports.removeProductFromWishlist = asyncHandler(async (req,res,next) => {
    const user = await User.findByIdAndDelete(req.user._id,{
        $pull:{whishlist: req.params.productId}
    },{new:true})

    res.status(200).json({status: 'success',
        message:'product Removed Successfully From Your WishList',
        data:user.whishlist})
})


// @desc  get product from wishlist
// @route get /api/v1/wishlist
// @acces private/user
exports.getLoggedUserWishsList = asyncHandler(async (req,res,next) => {
    const user = await User.findById(req.user._id.populate('wishList'),{new:true})

    res.status(200).json({status: 'success',
        data:user.whishlist})
})