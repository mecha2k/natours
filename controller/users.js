const multer = require("multer")
const sharp = require("sharp")

const User = require("../models/users")
const commons = require("./commons")
const appError = require("../utils/apperror")

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/img/users")
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1]
//     cb(null, `user-${req.body.name}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage = multer.memoryStorage()
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) cb(null, true)
  else cb(new appError("Not an image! Please upload only images.", 400), false)
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadUserPhoto = upload.single("photo")

exports.resizeUserPhoto = async function (req, res, next) {
  try {
    if (!req.file) return next()

    req.file.filename = `user-${req.body.name}-${Date.now()}.jpg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`)
  } catch (err) {
    console.log(err)
  }

  next()
}

const filterObj = function (obj, ...allowedFields) {
  const newObj = {}
  Object.keys(obj).forEach((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem]
  })

  return newObj
}

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id
  next()
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
  console.log(req.file)
  // console.log(req.body)

  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new appError("This route is not for password updates. Please use /updateMyPassword.", 400)
      )
    }

    const filteredBody = filterObj(req.body, "name", "email")
    if (req.file) filteredBody.photo = req.file.filename

    const update = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    })

    res.status(200).json({ status: "success", data: { user: update } })
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

exports.createUser = function (req, res) {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined! Please use /signup instead" })
}

exports.getUser = commons.getOne(User)
exports.getAllUsers = commons.getAll(User)
exports.updateUser = commons.updateOne(User)
exports.deleteUser = commons.deleteOne(User)
