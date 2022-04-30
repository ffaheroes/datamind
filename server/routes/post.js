const express = require('express'); // importing the package
const router = express.Router();
const _ = require('lodash');
const sanitizeHtml = require('sanitize-html');
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
    console.log('get post/')
    // const id = parseInt(req.params.id)
    try {
        const post = await db.collection('post').find({}).toArray()
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
});


router.get('/:_id', async (req, res) => {
    var id = req.params._id;       
    var o_id = new ObjectId(id);
    console.log('get post/',id)
    try {
        const post = await db.collection('post').find({_id:o_id}).toArray()

        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
  });


  router.get('/getpostbyuserid/:id', async (req, res) => {
    var user_id = req.params.id;       
    console.log('get getpostbyuserid/',user_id)
    try {
        const post = await db.collection('post').find({userId:user_id}).toArray()
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
  });



  router.get('/related/:_id', async (req, res) => {
    console.log('get post/series')
    var id = req.params._id;       
    var o_id = new ObjectId(id);
    try {
        const post = await db.collection('post').find({_id:o_id}).toArray()
        let userId = post[0]['userId']
        let series = post[0]['series']
        try {
            const post2 = await db.collection('post').find({userId:userId,series:series}).toArray()
            res.status(200).json(post2)
        } catch (err) {
            console.log(err)
            throw err
        }

        
    } catch (err) {
        console.log(err)
        throw err
    }
  });

  router.patch('/:_id', async (req, res) => {
    console.log('patch')
    // const postChanges = _.cloneDeep(req.body);
    console.log(req.body.title)

    var id = req.params._id;       
    var o_id = new ObjectId(id);
    let title = req.body.title;
    let subTitle = req.body.subTitle;
    let contentMarkup = req.body.contentMarkup;
    let isLargePreview = req.body.isLargePreview;
    let imgDescriptor = req.body.imgDescriptor;
    let tags = req.body.tags

    const now = new Date();
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var formattedDate = now.getDate()  + "-" + months[now.getMonth()] + "-" + now.getFullYear()
    let date = formattedDate

    try {
        const post = await db.collection('post').updateOne(
            {_id:o_id}, // Filter
            {$set: {"title": title,
                    "subTitle" : subTitle,
                    "contentMarkup" : contentMarkup,
                    "isLargePreview" : isLargePreview,
                    "imgDescriptor" : imgDescriptor,
                    "date" : date,
                    "tags" : tags}}, // Update
            {upsert: true} // add document with req.body._id if not exists 
        )
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
  });

  router.patch('/series/:_id', async (req, res) => {
    console.log('patch series ')
    console.log(req.body.series)
    var id = req.params._id;       
    var o_id = new ObjectId(id);
    let series = req.body.series;

    try {
        const post = await db.collection('post').updateOne(
            {_id:o_id}, // Filter
            {$set: {"series": series}}, // Update
            {upsert: true} // add document with req.body._id if not exists 
        )
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
  });

  router.delete('/:_id', async (req, res) => {
    console.log('delete')
    // const postChanges = _.cloneDeep(req.body);
    console.log(req.body.title)
    var id = req.params._id;       
    var o_id = new ObjectId(id);

    try {
        const post = await db.collection('post').deleteOne({_id:o_id})
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        throw err
    }
  });


  router.post('/', async (req, res) => {
    console.log('post insertone')
    // const postChanges = _.cloneDeep(req.body);
    console.log(req.body)
    
    let title = req.body.title;
    let subTitle = req.body.subTitle;
    let contentMarkup = req.body.contentMarkup;
    let isLargePreview = req.body.isLargePreview;
    if (req.body.imgDescriptor==='') {
        var imgDescriptor = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqQAWml86qP_eNqc-H-WTJkSaQKpPY42AOnD_oxmN1zC6ZUq3F67OjIJQURq0dSp31Us&usqp=CAU'
    } else {
        var imgDescriptor = req.body.imgDescriptor
    }
    
    let readTimeEstimate = "3min"
    let blogId = 1
    let userId = req.body.userId
    let tags = req.body.tags

    console.log('tags',tags)

    const now = new Date();
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var formattedDate = now.getDate()  + "-" + months[now.getMonth()] + "-" + now.getFullYear()
    let date = formattedDate

    try {
        const post = await db.collection('post').insertOne(
            {
            "blogId" : blogId,
            "userId" : userId,
            "title": title,
            "subTitle" : subTitle,
            "contentMarkup" : contentMarkup,
            "isLargePreview" : isLargePreview,
            "imgDescriptor" : imgDescriptor,
            "date": date,
            "readTimeEstimate" : readTimeEstimate,
            "tags": tags})
        console.log(post.insertedId.toString())
        res.status(200).send({'id' : post.insertedId.toString()});
    } catch (err) {
        console.log(err)
        throw err
    }
  });


  


  module.exports = router;