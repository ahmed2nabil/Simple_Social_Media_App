const User = require("../models/user");
const Post = require("../models/post");
const config = require("../utils/config");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
createUser : async function({ userInput },req){
const errors = [];

if(!validator.isEmail(userInput.email)) {
    errors.push({message : "Email is invalid"});
}
if(validator.isEmpty(userInput.password) || !validator.isLength(userInput.password,{min : 5})){
    errors.push({message : "Password is too short"});
}

if(errors.length > 0) {
    const error = new Error('Invalid Input');
    error.data = errors;
    error.code = 422;
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
},
login : async function({email , password}) {
    const user = await User.findOne({email : email}) 
    if(!user) {
        const error = new Error("User not found.");
        error.code = 401;
        throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual) {
        const error = new Error("Password is not Correct");
        error.code = 401;
        throw error;
    }
    const token = jwt.sign({
        userId : user._id.toString(),
        email : user.email
    },config.secret,
    {expiresIn : '1h'}
    );
    return { token : token , userId : user._id.toString()}
},
createPost : async function({postInput},req){
    if(!req.isAuth) {
        const error = new Error('Not authenticated');
        error.code = 401;
        throw error;
    }
    const errors = [];
    if(validator.isEmpty(postInput.title)) {
        errors.push({message :'Title is invalid.'});
    }
    if(validator.isEmpty(postInput.content)) {
        errors.push({message :'Content is invalid.'});
    }
    if(errors.length > 0) {
        const error = new Error('Invalid Input');
        error.data = errors;
        error.code = 422;
        throw error;
    }
const user = await User.findById(req.userId);
if(!user) {
    const error = new Error('Invalid user.');
    error.code = 401;
    throw error;   
}
    const post = new Post({
        title : postInput.title,
        content : postInput.content,
        imageUrl : postInput.imageUrl,
        creator :user
    });
    const newPost = await post.save();
    user.posts.push(newPost);
    await user.save();
    return {
        ...newPost._doc,
        _id : newPost._id.toString(), 
        createdAt : newPost.createdAt.toISOString(),
        updatedAt : newPost.updatedAt.toISOString()
    }
},
posts: async function({page},req){
    if(!req.isAuth) {
        const error = new Error('Not authenticated');
        error.code = 401;
        throw error;
    }
    if(!page){
        page = 1 ;
    }
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
    .sort({createdAt : -1})
    .skip((page -1) * perPage)
    .limit(perPage)
    .populate('creator');

    return {
        posts : posts.map( p => 
            {    return {
            ...p._doc,
            _id : p._id.toString(), 
            createdAt : p.createdAt.toISOString(),
            updatedAt : p.updatedAt.toISOString()
        }
    }),
    totalPosts : totalPosts
    }
},
post : async function({id},req) {
    if(!req.isAuth) {
        const error = new Error('Not authenticated');
        error.code = 401;
        throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if(!post) {
        const error = new Error("No post found.");
        error.code = 404;
        throw error;
    }
    return {
        ...post._doc,
        _id  : post._id.toString(),
        createdAt : post.createdAt.toISOString(),
        updatedAt : post.updatedAt.toISOString()
    }
},
updatedPost : async function({id,postInput},req){
    if(!req.isAuth) {
        const error = new Error('Not authenticated');
        error.code = 401;
        throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if(!post) {
        const error = new Error("No post found.");
        error.code = 404;
        throw error;
    }
    if(post.creator._id.toString() === req.userId.toString()) {
        const error = new Error("Not allowed.");
        error.code = 403;
        throw error;
    }
    const errors = [];
    if(validator.isEmpty(postInput.title)) {
        errors.push({message :'Title is invalid.'});
    }
    if(validator.isEmpty(postInput.content)) {
        errors.push({message :'Content is invalid.'});
    }
    if(errors.length > 0) {
        const error = new Error('Invalid Input');
        error.data = errors;
        error.code = 422;
        throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if(!postInput.imageUrl !== 'undefined') {
    post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
        ...updatedPost._doc,
        _id  : updatedPost._id.toString(),
        createdAt : updatedPost.createdAt.toISOString(),
        updatedAt : updatedPost.updatedAt.toISOString()
    }
}

};