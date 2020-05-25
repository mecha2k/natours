const express = require("express")
const router = express.Router()

const userControl = require("../controller/users")
const authControl = require("../controller/authorize")

router.post("/signup", authControl.signup)
router.post("/login", authControl.login)
router.post("/forgotPassword", authControl.forgotPassword)
router.patch("/resetPassword/:token", authControl.resetPassword)

router.use(authControl.protect)

// router.patch("/updateMyPassword", authControl.updatePassword)
// router.get("/me", userControl.getMe, userControl.getUser)
// router.patch("/updateMe", userControl.updateMe)
// router.delete("/deleteMe", userControl.deleteMe)
//
// router.use(authControl.restrictTo("admin"))

router.route("/").get(userControl.getAllUsers).post(userControl.createUser)

router
  .route("/:id")
  .get(userControl.getUser)
  .patch(userControl.updateUser)
  .delete(userControl.deleteUser)

module.exports = router
