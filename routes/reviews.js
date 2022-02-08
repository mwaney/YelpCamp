const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const { isLoggedin, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews')



router.post('/', isLoggedin, validateReview, catchAsync(reviews.createNewReview));

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;