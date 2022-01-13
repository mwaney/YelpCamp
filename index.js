const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

    // const db = mongoose.connection
    .then(() => {
        console.log('Database Connected')
    })
    .catch(err => {
        console.log('OH NO ERROR');
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping' });
    await camp.save();
    res.send(camp);
})


app.listen(3000, () => {
    console.log('APP IS LISTENING AT PORT 3000');
})
