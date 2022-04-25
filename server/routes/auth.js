const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

//register a user
router.post('/register', async (req,res) => {
    console.log('Post auth/register')
    console.log('req.body : ',req.body)
    
    const userExist = await db.collection('author').find({ username: req.body.username }).toArray()
    if (typeof userExist !== 'undefined' && userExist.length > 0) return res.status(400).send({'email' : 'Email already exists'});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    // Create New User

    try {
        const post = await db.collection('author').insertOne(
            {
            "username" : req.body.username,
            "passwordHash" : hashPassword,
            "avatarUrl": "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
            "bio" : ""})
        const token = jwt.sign({ _id : post.insertedId.toString() }, 'wsfbgkjhsdfkjsjdfoi')
        res.send({'token' : token, 'user_id' : post.insertedId.toString(), 'username' : req.body.username,'avatarUrl' : "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"});
    } catch (err) {
        console.log(err)
        throw err
    }

});


//login a user
router.post('/login', async (req,res) => {
    console.log('Post auth/login')
    console.log('req.body : ',req.body)

    // Checking if the email exists
    const userExist = await db.collection('author').find({ username: req.body.username }).toArray()
    console.log(userExist)
    if (userExist==[]) return res.status(400).send({'email' : 'Email does not exists'});
    
    // Checking passwords
    const validPass = await bcrypt.compare(req.body.password,userExist[0].passwordHash);
    if(!validPass) return res.status(400).send({'password' : 'Invalid password'})

    // Create and assign a token
    const token = jwt.sign({ _id : userExist[0]._id }, 'wsfbgkjhsdfkjsjdfoi')

    // Get all Series of users
    const post = await db.collection('post').find({userId:userExist[0]._id.toString()}).toArray()
    let series = []
    post.map((p) => series.push(p.series))
    uniqSeries = [...new Set(series)].filter(Boolean); // Cool Stuff ! SET to remove duplicate from array, Filter boolean to remove unefined and nan

    res.header('token',token).send({'token' : token, 'user_id' : userExist[0]._id, 'username' : userExist[0].username,'avatarUrl' : userExist[0].avatarUrl,'series' : uniqSeries});
});

router.post('/logout', async (req,res) => {
    console.log('Post auth/logout')
    res.status(200).send({'status' : 'logout'})
});


module.exports = router;

