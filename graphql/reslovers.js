const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
module.exports = {
createUser : async function({ userInput },req){
const errors = [];

if(validator.isEmail(userInput.email)) {
    errors.push({message : "Email is invalid"});
}
if(validator.isEmpty(userInput.password) || 
    validator.isLength(userInput.password,{min : 5})
){
    errors.push({message : "Password is too short"});
}

if(errors.length > 0) {
    const error = new Error('Invalid Input');
    throw error;
}
const existingUser = await User.findOne({email : userInput.email});
if(existingUser) {
    const error = new Error("User exists already!");
    throw error;
}
const hasedPw =  await bcrypt.hash(userInput.password,12);
const user = new User({
    email : userInput.email,
    name : userInput.name,
    password : hasedPw
});

const createdUser = await user.save();

return {...createdUser._doc , _id : createdUser._id.toString()};
}

}