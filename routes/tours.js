const express = require("express")
const router = express.Router()

const tourControl = require("../controller/tours")
const authControl = require("../controller/authorize")

// router.param("id", tourControl.checkID)

router.route("/top-5-cheap").get(tourControl.aliasTopTours, tourControl.getAllTours)
router.route("/tour-stats").get(tourControl.getTourStats)
router.route("/monthly-plan/:year").get(tourControl.getMonthlyPlan)

router
  .route("/")
  .get(tourControl.getAllTours)
  .post(authControl.protect, authControl.restrictTo("admin", "lead-guide"), tourControl.createTour)
// .post(tourControl.checkBody, tourControl.createTour)

router
  .route("/:id")
  .get(tourControl.getTour)
  .patch(authControl.protect, authControl.restrictTo("admin", "lead-guide"), tourControl.updateTour)
  .delete(
    authControl.protect,
    authControl.restrictTo("admin", "lead-guide"),
    tourControl.deleteTour
  )

module.exports = router
