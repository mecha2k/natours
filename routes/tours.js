const express = require("express")
const router = express.Router()

const controller = require("../Controller/tours")

// router.param("id", controller.checkID)

router.route("/top-5-cheap").get(controller.aliasTopTours, controller.getAllTours)
router.route("/tour-stats").get(controller.getTourStats)
router.route("/monthly-plan/:year").get(controller.getMonthlyPlan)

router
  .route("/")
  .get(controller.getAllTours)
  .post(controller.createTour)
// .post(controller.checkBody, controller.createTour)

router
  .route("/:id")
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour)

module.exports = router
