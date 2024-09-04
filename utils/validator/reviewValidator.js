
const { check ,body } = require('express-validator');
const validatorMIddleware = require('../../middleWares/validatorMIddleware');
const Review = require('../../models/reviewModel')

exports.createReviewValidator = [
    check('title')
    .optional(),


    check('ratings').notEmpty().withMessage('should do rate')
    .isFloat({min: 1 , max:5})
    .withMessage('Ratings value must be between 1 to 5'),

    check('user').isMongoId().withMessage('Invalid Review Id Format '),

    check('product').isMongoId()
    .withMessage('Invalid Review Id Format')
    .custom((val,{req}) => {
      return  Review.findOne({product:req.body.product,user:req.user._id}).then((review)=>{ 
        
        if(!review){
            return  Promise.reject(new Error(`You already Create A Review Before`))
        }
    }
        )
    })
    ,validatorMIddleware
]


exports.updateReviewValidator =[
    check('id')
    .isMongoId()
    .withMessage('Invalid Review id').
    custom((val,{req}) => {
 return  Review.findById(val).then((review) => {
        if(!review)
        {
            return  Promise.reject(new Error(`There is no review with id ${val}`))
        }
        if(review.user._id.toString() !== req.user._id.toString()){
            return  Promise.reject(new Error(`you dont allow to berform this action `))
        }
       })
    })
    ,
    validatorMIddleware
]



exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id'),
    validatorMIddleware
]



exports.deleteReviewValidator = [
    check('id')
      .isMongoId()
      .withMessage('Invalid Review id format')
      .custom((val, { req }) => {
        // Check review ownership before update
        if (req.user.role === 'user') {
          return Review.findById(val).then((review) => {
            if (!review) {
              return Promise.reject(
                new Error(`There is no review with id ${val}`)
              );
            }
            
            if (review.user._id.toString() !== req.user._id.toString()) {
              return Promise.reject(
                new Error(`Your are not allowed to perform this action`)
              );
            }
          });
        }
        return true;
      }),
    validatorMIddleware,
  ];