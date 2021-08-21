const express = require('express');
const {main} = require('./database/dbconnection');

const app = express();


const PORT = process.env.PORT || 3000;

main().catch(console.error);
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`);
})