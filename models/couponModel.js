const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
name:{
    type:String,
    trim:true,
    required:[true,'Coupon name required'],
    unique:true,
},
expire:{
   type: Date,
   required:[true,'Coupon Expire time Required'],
},
discount:{
    type:Number,
    required:[true,'Coupon discount value Required']
}
},{timestamps:true}
)

module.exports = mongoose.model('Coupon',couponSchema)