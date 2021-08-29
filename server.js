const express = require('express');
const mongoose = require('mongoose');
const {graphqlHTTP }= require('express-graphql');
const app = express();


const PORT = process.env.PORT || 3000;
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/reslovers');
const auth = require('./middlewares/is-auth');

app.use(auth.verfiyToken);
app.use(
    '/graphql',
    graphqlHTTP({
    schema : graphqlSchema,
    rootValue : graphqlResolver,
    graphiql : true,
    customFormatErrorFn(err) {
        if(!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message ||  "An error Occured!";
        const code = err.originalError.code || 500;
        return {message : message , status : code, data : data}
    }
}))

const url = "mongodb+srv://user:passwordnode@cluster0.xbewz.mongodb.net/SMDB?retryWrites=true&w=majority"
mongoose.connect(url,{useUnifiedTopology :true,useNewUrlParser:true})
.then(console.log('DB Connected successfully'))
.catch(console.error);
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`);
})