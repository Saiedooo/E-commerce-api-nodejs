
const mongoose = require('mongoose') 
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
name:{
    type:String,
    trim: true,
    required:[true,'name required'],
},
slug:{
    type:String,
    lowerCase:true,
},
email:{
    type:String,
    required:[true,'email required'],
    unique: true,
    lowerCase: true
},
phone:String,
proFileImg:String,
password:{
    type:String ,
    required:[true,'Password required'],
    minlength:[6,"too Short password"]
},
passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

role:{
    type:String,
    enum:["user",'manger','admin'],
    default: 'user'
},
active:{
    type:Boolean,
    default:true
},
whishlist:[{
    type:mongoose.Schema.ObjectId,
    ref:'Product'
}],
addresses:[
    {
        id:{type:mongoose.Schema.Types.ObjectId},
        alias:String,
        details:String,
        phone:String,
        city:String,
        postalCode:String
    }
]
},{timeStamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    // hasshing password
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User