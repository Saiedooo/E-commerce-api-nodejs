const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
      type:String ,
      required: [true,"Category required"] ,
      unique:[true , "name must be unique"],
      minlength: [3,"Too Short Category Name"],
      maxlength:[32,"Too long Category name"]

    },
    slug:{
      type: String,
      lowercase:true,
    },

    image:{
      type: String

     } 
  },
  {timestamps:true});

const setImageUrl = (doc) => {
  if(doc.image){
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageUrl
 }
}


  categorySchema.post("init",(doc) => {
    setImageUrl(doc)
    
  })
  
  categorySchema.post("save",(doc) => {
    setImageUrl(doc)
    
  })
  
  const CategoryModel = mongoose.model("Category", categorySchema);
  
  module.exports = CategoryModel 