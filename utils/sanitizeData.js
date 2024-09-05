exports.sanitizeUser = function(user){
    return{
        id:    req.user._id,
        name:  user.name,
        email : user.email
    }
}
