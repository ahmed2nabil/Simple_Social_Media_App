const {buildSchema} = require("graphql");

module.exports = buildSchema(`
type Post {
    _id : ID!
    title : String!
    content : String!
    imageUrl : String!
    creator : User!
    createdAt : String!
    UpdatedAt : String!
}
type User {
    _id : ID!
    email : String!
    name : String!
    password : String
    status : String!
    posts : [Post!]!
}
type AuthData {
    token : String!
    userId : String!
}
input UserInputData {
   email : String!
   name : String!
   password : String!
}
input PostInputData {
    title : String!
    content : String!
    imageUrl : String!
}
type PostData {
    posts : [Post!]!
    totalPosts : Int!
}
type RootQuery {
    login(email: String! , password: String!) : AuthData!
    posts(page : Int): PostData!
    post(id : ID!) : Post!
}
type RootMutat {
    createUser(userInput : UserInputData) : User!
    createPost(postInput : PostInputData) : Post!
}
schema {
    query : RootQuery
    mutation : RootMutat
}
`)