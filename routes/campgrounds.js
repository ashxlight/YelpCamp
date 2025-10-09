const express = require('express');
const router = express.Router();
const { CampgroundSchema } = require('../schemas');
const campgrounds=require('../controllers/campgrounds')

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');
const multer  = require('multer');
const {storage}=require('../Cloudinary');
const upload = multer({ storage });



router.route('/')
  .get( catchAsync(campgrounds.index))
  .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
  // .post(upload.array('image'),(req,res)=>{
  //   console.log(req.body,req.files);
  //   res.send("IT WORKED");
  // })

router.get('/new',isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))
  .put(isLoggedIn,isAuthor,validateCampground,isAuthor, catchAsync(campgrounds.updateCampground));

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm));







module.exports = router;
