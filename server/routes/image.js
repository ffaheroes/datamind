const express = require('express'); // importing the package
const router = express.Router();
const _ = require('lodash');
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


// file upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dir = 'uploads/'
  
      fs.access(dir, (err) => {
        if (err) {
          return fs.mkdir(dir, (error) => cb(error, dir))
        } else {
          return cb(null, dir)
        }
      })
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`)
    },
  })
  
  const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb('Images only!')
    }
  }
  
  const upload = multer({
    storage,
    fileFilter(req, file, cb) {
      checkFileType(file, cb)
    },
  })
  
  router.post('/uploadFile', upload.single('image'), (req, res) => {
    const url = 'http://127.0.0.1:8080/api/image/' + req.file.path.replace(/\\/g, '/')
    console.log('/uploadFile')
    res.send({
      success: 1,
      file: {
        url,
      },
    })
  })

  router.get('/uploads/:id', (req, res) => {
    var id = req.params.id;    
    console.log('.//uploads/' + id)
    res.sendFile(path.resolve('./uploads/' + id))
  })






router.post('/fetchUrl', async (req,res) => {
    console.log('get image/fetchUrl')
    res.status(200).send({
        success: 1,
        file: {
          url,
        },
      })
    // const id = parseInt(req.params.id)
    // try {
    //     const post = await db.collection('post').find({}).toArray()
    //     res.status(200).json(post)
    // } catch (err) {
    //     console.log(err)
    //     throw err
    // }
});



  module.exports = router;