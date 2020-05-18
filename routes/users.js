const express = require("express")
const router = express.Router()

const userControl = require("../controller/users")
const authControl = require("../controller/authorize")

router.route("/").get(userControl.getAllUsers).post(userControl.createUser)

router
  .route("/:id")
  .get(userControl.getUser)
  .patch(userControl.updateUser)
  .delete(userControl.deleteUser)

router.post("/signup", authControl.signup)
// router.post("/login", authControl.login)
//
// router.post("/forgotPassword", authControl.forgotPassword)
// router.patch("/resetPassword/:token", authControl.resetPassword)
//
// router.patch("/updateMyPassword", authControl.protect, authControl.updatePassword)
//
// router.patch("/updateMe", authControl.protect, userControl.updateMe)
// router.delete("/deleteMe", authControl.protect, userControl.deleteMe)

module.exports = router
