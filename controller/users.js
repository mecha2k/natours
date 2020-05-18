const User = require("../models/users")
const appError = require("./apperror")

const filterObj = function (obj, ...allowedFields) {
  const newObj = {}
  Object.keys(obj).forEach((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem]
  })

  return newObj
}

exports.getAllUsers = async function (req, res, next) {
  try {
    const users = await User.find()

    res.status(200).json({ status: "success", results: users.length, data: { users } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.updateMe = async function (req, res, next) {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new appError("This route is not for password updates. Please use /updateMyPassword.", 400)
      )
    }

    const filteredBody = filterObj(req.body, "name", "email")
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ status: "success", data: { user: updatedUser } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.deleteMe = async function (req, res) {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({ status: "success", data: null })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.getUser = function (req, res) {
  res.status(500).json({ status: "error", message: "This route is not yet defined!" })
}
exports.createUser = function (req, res) {
  res.status(500).json({ status: "error", message: "This route is not yet defined!" })
}
exports.updateUser = function (req, res) {
  res.status(500).json({ status: "error", message: "This route is not yet defined!" })
}
exports.deleteUser = function (req, res) {
  res.status(500).json({ status: "error", message: "This route is not yet defined!" })
}
