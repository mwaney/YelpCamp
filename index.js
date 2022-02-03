const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews)



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh boy, Something went Wrong!!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('APP IS LISTENING AT PORT 3000');
});
