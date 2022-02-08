const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCamp })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash('error', 'Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCamp })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully Edited ${campground.title}!!`);
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}