const express = require("express")
const router = express.Router()

const reviewControl = require("../controller/reviews")
const authControl = require("../controller/authorize")

router
  .route("/")
  .get(reviewControl.getAllReviews)
  .post(authControl.protect, authControl.restrictTo("user"), reviewControl.createReview)

// router.route("/top-5-cheap").get(tourControl.aliasTopTours, tourControl.getAllTours)
// router.route("/tour-stats").get(tourControl.getTourStats)
// router.route("/monthly-plan/:year").get(tourControl.getMonthlyPlan)

module.exports = router
