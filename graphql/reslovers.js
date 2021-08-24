const User = require("../models/user");
const bcrypt = require("bcrypt");
module.exports = {
createUser : async function({ userInput },req){
    console.log(userInput);
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