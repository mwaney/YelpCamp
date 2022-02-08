const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');

const { isLoggedin, validateCampground, isAuthor } = require('../middleware');



router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedin, campgrounds.renderNewForm)

router.post('/', isLoggedin, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedin, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
