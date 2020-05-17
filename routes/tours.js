const express = require("express")
const router = express.Router()

const tourControl = require("../Controller/tours")
const authControl = require("../Controller/authorize")

// router.param("id", tourControl.checkID)

router.route("/top-5-cheap").get(tourControl.aliasTopTours, tourControl.getAllTours)
router.route("/tour-stats").get(tourControl.getTourStats)
router.route("/monthly-plan/:year").get(tourControl.getMonthlyPlan)

router.route("/").get(tourControl.getAllTours).post(tourControl.createTour)
// .post(tourControl.checkBody, tourControl.createTour)

router
  .route("/:id")
  .get(tourControl.getTour)
  .patch(tourControl.updateTour)
  .delete(tourControl.deleteTour)

router.post("/signup", authControl.signup)

module.exports = router
