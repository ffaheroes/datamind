const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ffaheroes:Vanaskew1@cluster0-jr6sc.mongodb.net';
const dbName = 'datamind';
let db
 
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to MongoDB Server");
  db = client.db(dbName);
});

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
//Import routes.

// const twitterRoute = require('./routes/twitter')
// app.use('/api/twitter', twitterRoute);

const PostRoute = require('./routes/post')
app.use('/api/post', PostRoute);

const AuthorRoute = require('./routes/author')
app.use('/api/author', AuthorRoute);

const BlogRoute = require('./routes/blog')
app.use('/api/blog', BlogRoute);

const AuthRoute = require('./routes/auth')
app.use('/api/auth', AuthRoute);

app.get('/', async (req,res) => {
    console.log('get')
    // const id = parseInt(req.params.id)
    try {
        const blog = await db.collection('blog').find({}).toArray()
        res.status(200).json(blog)
    } catch (err) {
        console.log(err)
        throw err
    }
})


app.listen(8080, () => {
    console.log("DataMind API Listenning")
  })