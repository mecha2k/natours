const express = require("express")
const router = express.Router()

const tourControl = require("../controller/tours")
const authControl = require("../controller/authorize")
const reviewRoute = require("../routes/reviews")

router.use("/:tourId/reviews", reviewRoute)

router.route("/top-5-cheap").get(tourControl.aliasTopTours, tourControl.getAllTours)
router.route("/tour-stats").get(tourControl.getTourStats)
router
  .route("/monthly-plan/:year")
  .get(
    authControl.protect,
    authControl.restrictTo("admin", "lead-guide", "guide"),
    tourControl.getMonthlyPlan
  )
router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourControl.getToursWithin)
router.route("/distances/:latlng/unit/:unit").get(tourControl.getDistances)

router
  .route("/")
  .get(tourControl.getAllTours)
  .post(authControl.protect, authControl.restrictTo("admin", "lead-guide"), tourControl.createTour)

router
  .route("/:id")
  .get(tourControl.getTour)
  .patch(
    authControl.protect,
    authControl.restrictTo("admin", "lead-guide"),
    tourControl.uploadTourImages,
    tourControl.resizeTourImages,
    tourControl.updateTour
  )
  .delete(
    authControl.protect,
    authControl.restrictTo("admin", "lead-guide"),
    tourControl.deleteTour
  )

module.exports = router

// const reviewControl = require("../controller/reviews")
//
// router
//   .route("/:id/reviews")
//   .post(authControl.protect, authControl.restrictTo("user"), reviewControl.createReview)
