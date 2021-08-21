const {MongoClient} = require('mongodb');

exports.main = async function (){

     const url = "mongodb+srv://user:passwordnode@cluster0.xbewz.mongodb.net/SMDB?retryWrites=true&w=majority"

    const client = new MongoClient(url);
 
    try {
const connect =    await client.connect();
console.log('Connected correctly to database');

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

