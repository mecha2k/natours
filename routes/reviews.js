const express = require("express")

const reviewControl = require("../controller/reviews")
const authControl = require("../controller/authorize")

const router = express.Router({ mergeParams: true })

router.use(authControl.protect)

router
  .route("/")
  .get(reviewControl.getAllReviews)
  .post(authControl.restrictTo("user"), reviewControl.setTourUserIds, reviewControl.createReview)

router
  .route("/:id")
  .get(reviewControl.getReview)
  .patch(authControl.restrictTo("user", "admin"), reviewControl.updateReview)
  .delete(authControl.restrictTo("user", "admin"), reviewControl.deleteReview)

module.exports = router
