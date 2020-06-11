const express = require("express")
const viewsControl = require("../controller/views")
const authControl = require("../controller/authorize")

const router = express.Router()

router.use(viewsControl.alerts)

router.get("/", authControl.isLoggedIn, viewsControl.getTours)
router.get("/tours/:slug", authControl.isLoggedIn, viewsControl.getTour)
router.get("/login", authControl.isLoggedIn, viewsControl.getLoginForm)
router.get("/me", authControl.protect, viewsControl.getAccount)
router.get("/my-tours", authControl.protect, viewsControl.getMyTours)
router.post("/submit-user-data", authControl.protect, viewsControl.updateUserData)

module.exports = router
