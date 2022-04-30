const express = require('express'); // importing the package
const router = express.Router();
var ObjectId = require('mongodb').ObjectId; 


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ffaheroes:Vanaskew1@cluster0-jr6sc.mongodb.net';
const dbName = 'datamind';
let db
 
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to MongoDB Server");
  db = client.db(dbName);
});

router.get('/', async (req,res) => {
    console.log('get author/')
    // const id = parseInt(req.params.id)
    try {
        const author = await db.collection('author').find({}).toArray()
        res.status(200).json(author)
    } catch (err) {
        console.log(err)
        throw err
    }
});


router.get('/:id', async (req, res) => {
    console.log('get author/id')
    try {
        const author = await db.collection('author').find({ id: Number(req.params.id) }).toArray()
        res.status(200).json(author)
    } catch (err) {
        console.log(err)
        throw err
    }
  });

  router.get('/getidbyname/:name', async (req, res) => {
    console.log('get getidbyname/')
    try {
        const author = await db.collection('author').find({ username: req.params.name }).toArray()
        console.log(author)
        res.status(200).send([{'user_id' : author[0]._id, 'username' : author[0].username,'avatarUrl' : author[0].avatarUrl,'bio' : author[0].bio,'links' : author[0].links}])
    } catch (err) {
        console.log(err)
        throw err
    }
  });


  router.patch('/updateprofile/:id', async (req, res) => {
    console.log('patch updateprofile/:id',req.params.id)
    var id = req.params.id;       
    var o_id = new ObjectId(id);

    // let profile = req.body.profile;
    console.log(o_id)
    console.log(req.body)




    try {
        const author = await db.collection('author').updateOne(
            {_id:o_id}, // Filter
            {$set: req.body}, // Update
            {upsert: true} // add document with req.body._id if not exists 
        )
        res.status(200).json(author)
    } catch (err) {
        console.log(err)
        throw err
    }


  });






  module.exports = router;