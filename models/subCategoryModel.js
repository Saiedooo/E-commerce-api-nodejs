const mongoose = require('mongoose') 



const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "SubCategory should be unique"],
        minlength: [2, "Name is too short"],
        maxlength: [32, "Name is too long"],
        required: [true, "SubCategory name is required"],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "SubCategory must belong to a parent category"],
    }
}, { timestamps: true });


module.exports =  mongoose.model("SubCategory", subCategorySchema)

