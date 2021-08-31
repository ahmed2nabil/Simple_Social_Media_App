const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer  = require('multer');
const {graphqlHTTP }= require('express-graphql');
const app = express();


const PORT = process.env.PORT || 3000;
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/reslovers');
const auth = require('./middlewares/is-auth');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
  app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(auth.verfiyToken);

app.put("/post-image",(req,res,next) => {
  if(!req.isAuth) {
    const error = new Error('Not authenticated');
    error.code = 401;
    throw error;
}
  if(!req.file){
        return res.status(200).json({message : "No file provided"});
    }
    if(req.body.oldPath) {
        clearImage(req.file);
    }

    return res.status(201).json({message : "file stored.",filePath : req.file.path});

})  
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


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };
const url = "mongodb+srv://user:passwordnode@cluster0.xbewz.mongodb.net/SMDB?retryWrites=true&w=majority"
mongoose.connect(url,{useUnifiedTopology :true,useNewUrlParser:true})
.then(console.log('DB Connected successfully'))
.catch(console.error);
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`);
})
