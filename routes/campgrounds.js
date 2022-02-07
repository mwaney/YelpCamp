const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const { isLoggedin } = require('../middleware');






const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}));

router.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedin, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground)
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate('reviews');
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCamp })
}));

router.get('/:id/edit', isLoggedin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCamp })
}));

router.put('/:id', isLoggedin, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // res.send(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //console.log(campground);
    req.flash('success', `Successfully Edited ${campground.title}!!`);
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedin, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}));

module.exports = router;
