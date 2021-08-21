const express = require('express');
const mongoose = require('mongoose');
const app = express();


const PORT = process.env.PORT || 3000;



const url = "mongodb+srv://user:passwordnode@cluster0.xbewz.mongodb.net/SMDB?retryWrites=true&w=majority"
mongoose.connect(url,{useUnifiedTopology :true,useNewUrlParser:true})
.then(console.log('DB Connected successfully'))
.catch(console.error);
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`);
})