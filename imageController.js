var express = require('express')
var router = express.Router()
var multer = require('multer')
var path = require('path')

var storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req,file,cb)=>{
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

var upload = multer({
    storage : storage
})

var Image = require('./imageModel')
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use('/image',express.static('upload/images'))
router.post('/insert',upload.single('image'),(req,res)=>{
    console.log(req.file)
    console.log(req.body)
    

    if(!req.body || !req.file){
        return  res.status(400).json({
            message : "Full data required"
        })
    }
    //create a image
    const image = new Image({
        name: req.body.name,
        email: req.body.email,
        image:req.file.destination+"/"+req.file.filename
    })
    //save the image
    image.save()
    .then(data => res.status(200).json({
            message : "Success",
            response:{
                image_url : "http://localhost:8080/image/"+req.file.filename,
                data: data
            }
    }))
    .catch(err=>{
        res.status(500).json({
            message:"unable to create record in database "+err.message
        })
    })
})

router.get('/getAll',(req,res)=>{
    Image.find({})
    .then(data=>{
        if(!data){
            return res.status(400).json({
                message:"No records found!"
            })
        }
    res.status(200).json(data)
    })
    .catch(err => {
        res.status(500).json({
            message:"Unable to retrive data "+err.message
        })
    })
})

router.get('/get/:name',(req,res)=>{
    if(!req.params.name){
        return res.status(400).json({
            message : "Unique is required"
        })
    }

    Image.findOne(req.params)
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message:"Cannot find data with id "+ req.params.name
            })
        }
        res.status(200).json({
            message: "Success",
            data: data,
        })
    })
    .catch(err=>{
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.email
            });                
        }
        res.status(500).send({
            message : "Unable to fetch data "+err.message
        })
    })
})

router.put('/update/:name',(req,res)=>{
    console.log(req.params)
    if(!req.params || !req.body){
        return res.status(400).json({
            message : "Bad request "
        })
    }
    Image.findOneAndUpdate(req.params,req.body,{new:true})
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message: "No record found with id "+req.params.id
            })
        }
        res.status(200).json(data)
    })
    .catch(err =>{
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        res.status(500).json({
            message : "Unable to update data "+err.message
        })
    })
})

router.delete('/delete/:name',(req,res)=>{
    console.log(req.params)
    if(!req.params.email){
        return res.status(400).json({
            message: "Bad request"
        })
    }
    Image.findOneAndDelete(req.params)
    .then(data =>{
        if(!data){
            return res.status(404).json({
                message:"No record found with id "+req.params.name
            })
        }
        res.status(200).json({
            message: "successfully record deleted with id "+req.params.name
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound'){
            res.status(404).json({
                message : "No record found with id "+req.params.id +" "+ err.message
            })
        }
        res.status(500).json({
            message : "Unable to delete record " + err.message
        })
    })
})
module.exports = router