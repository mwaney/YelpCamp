const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

const { isLoggedin, validateCampground, isAuthor } = require('../middleware');



router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}));

router.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedin, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(foundCamp);
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCamp })
}));

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCamp })
}));

router.put('/:id', isLoggedin, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // res.send(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //console.log(campground);
    req.flash('success', `Successfully Edited ${campground.title}!!`);
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedin, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}));

module.exports = router;
