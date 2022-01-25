const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

    // const db = mongoose.connection
    .then(() => {
        console.log('Database Connected')
    })
    .catch(err => {
        console.log('OH NO ERROR');
        console.log(err);
    })

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    console.log(campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show', { foundCamp })
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp })
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    // res.send(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen(3000, () => {
    console.log('APP IS LISTENING AT PORT 3000');
});
