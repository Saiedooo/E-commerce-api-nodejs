const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc  Add Address to User addresses List
// @route get /api/v1/addresses
// @acces private/user
exports.addAddress = asyncHandler(async (req, res, next) => {
      // $addToSet => add address object to user addresses  array if address not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res
    .status(200)
    .json({
      status: "success",
      message: "address Added Successfully ",
      data: user.addresses,
    });
});

// @desc  remove Address From User addresses List
// @route delete /api/v1/wishlist/addresses
// @acces private/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
      // $pull => remove address object from user addresses array if addressId exist
  const user = await User.findByIdAndDelete(
    req.user._id,
    {
      $pull: { addresses:{_id: req.params.addressId} },
    },
    { new: true }
  );

  res
    .status(200)
    .json({
      status: "success",
      message: "address Removed Successfully ",
      data: user.addresses,
    });
});

// @desc  get addresses from address List
// @route get /api/v1/addresses
// @acces private/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses');
  
    res.status(200).json({
      status: 'success',
      results: user.addresses.length,
      data: user.addresses,
    });
  });

 