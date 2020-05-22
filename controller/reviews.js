const Review = require("./../models/reviews")

exports.setTourUserIds = function (req, res, next) {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

exports.getAllReviews = async function (req, res, next) {
  try {
    const reviews = await Review.find()

    res.status(200).json({ status: "success", results: reviews.length, data: { reviews } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.getReview = async function (req, res, next) {
  try {
    const review = await tourDB.findById(req.params.id)

    res.status(200).json({ status: "success", data: { review } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.createReview = async function (req, res, next) {
  try {
    const newreview = await Review.create(req.body)

    res.status(201).json({ status: "success", data: { review: newreview } })
  } catch (error) {
    res.status(400).json({ status: "fail", message: error })
  }
}

// exports.getAllReviews = factory.getAll(Review);
// exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);
