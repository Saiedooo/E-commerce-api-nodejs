const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require('../utils/apiFeatures')


exports.deleteOne = (model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const documents = await model.findByIdAndDelete(id);
    if (!documents) {
      return next(new ApiError(`No documents for this id ${id}`, 404));
    }
    // documents.remove()
    res.status(200).json();
  });
  



 exports.updateOne = (model)=> asyncHandler(async (req, res, next) => {
 

    const documents = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!documents) {
      return next(new ApiError(`No documents for this id ${ req.params.id}`, 404));
    }
    documents.save()
    res.status(200).json({ data: documents });
  }); 



  exports.createOne = (model) =>  asyncHandler(async (req, res) => {


    const newDocument = await model.create( req.body );
    res.status(201).json({ data: newDocument });
  });

  exports.getOneById = (model,populateOpts) => asyncHandler(async (req,res,next)=>{
 
    let query =  model.findById(req.params.id)
    if(populateOpts){
      query = query.popualte(populateOpts)
    }
    const getOneDocument = await query
    if(!getOneDocument){
      return next(new ApiError(`No Document for this id ${req.params.id}`,404))
    }
    res.status(200).json({data:getOneDocument})
  
  })

  exports.getAll = (model,modelname = ' ')=> asyncHandler(async (req, res) => {

    let filter = {}
    if( req.filterObj )
       {
        filter = req.filterObj
      }
    const documentsCounts = await model.countDocuments()
  
   const apiFeatures = new ApiFeatures(model.find(filter),req.query)
   .paginate(documentsCounts)
   .filter()
   .search(modelname)
   .limitFields()
   .sort()
  const {mongooseQuery,paginationResults} = apiFeatures
   const documents = await mongooseQuery
   res.status(200).json({ results: documents.length,paginationResults ,data: documents });
  });