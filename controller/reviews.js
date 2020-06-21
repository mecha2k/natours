const Review = require("./../models/reviews")
const commons = require("./commons")

exports.setTourUserIds = function (req, res, next) {
  if (!req.body.tour) req.body.tour = req.params.id
  if (!req.body.user) req.body.user = req.user.id
  next()
}

exports.getAllReviews = commons.getAll(Review)
exports.getReview = commons.getOne(Review)
exports.createReview = commons.createOne(Review)
exports.updateReview = commons.updateOne(Review)
exports.deleteReview = commons.deleteOne(Review)
