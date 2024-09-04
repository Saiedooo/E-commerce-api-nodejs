const multer = require('multer')

const ApiError = require('../utils/apiError');

const multerOptions = () => {
               //disk Storage solution 

    // there is a point if u want storage abuffer u should use sharp and memeory storage to do img process 
    // const multerStorage = multer.diskStorage({
    //     destination: function(req,res,cb) {
    //         cb(null,'uploads/categories')
    //     },
    //     filename:function(req,file,cb){
    
    //         // to do this --> category-id-date-jpeg 
    //         const ext = file.mimetype.split('/')[1] //consolelog file.mimetype will do image/jpeg 
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
    //          cb(null,filename) //here return the callback and pass null for no error and teh filename
    //     }
    // })
    const multerStorage = multer.memoryStorage()

    const multerFilter = function(req,file,cb){
        if(file.mimetype.startsWith("image"))
        {
         cb(null,true)   
        } else{
            cb(new ApiError(`Only image Allowed`,400,false))
        }   
    }
    
    const upload = multer({storage:multerStorage,fileFilter:multerFilter})
    return upload
}

exports.uploadSingleImage = (fieldName) =>  multerOptions().single(fieldName)



exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields)
