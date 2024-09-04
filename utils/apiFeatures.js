const { modelNames } = require("mongoose")

class ApiFeatures{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery = mongooseQuery 
        this.queryString = queryString
    }

    filter(){

 const quersyStringObj = { ...this.queryString}

const excludesFields = ["page","sort","limit","fields","keyword"]
excludesFields.forEach((v)=> delete quersyStringObj[v] )

// aplly filteration usiing [gte|gt|lte|lt]
let queryStr = JSON.stringify(quersyStringObj)
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

this.mongooseQuery =  this.mongooseQuery.find(JSON.parse(queryStr))

return this

    }

    sort(){

        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
           this.mongooseQuery =  this.mongooseQuery.sort(sortBy)
          }else{
            this.mongooseQuery =  this.mongooseQuery.sort('-createdAt')
          }
          return this
    }

    limitFields(){

        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(fields)
          }
          else{
            this.mongooseQuery = this.mongooseQuery.select('-__v')
          }
          return this

    }

search(modelName){

        if(this.queryString.keyword){
            let query = {}
        if(modelName === "products")    

          {

            query.$or = [
              {title : { $regex: this.queryString.keyword, $options: 'i'}}, 
              {description: {$regex:this.queryString.keyword, $options: 'i'}}]
          

          }
          else
          {
            query  = {name: {$regex:this.queryString.keyword, $options:'i'}}
          }
              this.mongooseQuery = this.mongooseQuery.find(query)
          }
          return this
    }

    countDocuments
 paginate(countDocuments){
        // 2)Pag ination
  const page = this.queryString.page * 1 || 1;
  const limit = this.queryString.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const endIndex = page * limit 


const pagination = {}

  pagination.currentPage = page 
  pagination.limit = limit
  pagination.numberOfPages = Math.ceil(countDocuments / limit)


if(endIndex < countDocuments){
  pagination.next = page + 1
}
if(skip > 0)
  {
  pagination.previous = page -1 
 }

  this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)

  this.paginationResults = pagination

  return this
    }
}

module.exports = ApiFeatures