const express = require('express'); // importing the package
const router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ffaheroes:Vanaskew1@cluster0-jr6sc.mongodb.net';
const dbName = 'datamind';
let db
 
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to MongoDB Server");
  db = client.db(dbName);
});

router.get('/', async (req,res) => {
    console.log('get blog/')
    // const id = parseInt(req.params.id)
    try {
        const blog = await db.collection('blog').find({}).toArray()
        res.status(200).json(blog)
    } catch (err) {
        console.log(err)
        throw err
    }
});



router.get('/:id', async (req, res) => {
    console.log('get blog/id')
    try {
        const blog = await db.collection('blog').find({ id: Number(req.params.id) }).toArray()
        res.status(200).json(blog)
    } catch (err) {
        console.log(err)
        throw err
    }
  });

  module.exports = router;