const multer = require("multer")
const sharp = require("sharp")

const Tour = require("../models/tours")
const commons = require("./commons")
const appError = require("../utils/apperror")

const multerStorage = multer.memoryStorage()
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) cb(null, true)
  else cb(new appError("Not an image! Please upload only images.", 400), false)
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 }
])

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = async function (req, res, next) {
  try {
    if (!req.files.imageCover || !req.files.images) return next()

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpg`
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`)

    req.body.images = []

    await Promise.all(
      req.files.images.map(async function (file, i) {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`)

        req.body.images.push(filename)
      })
    )
  } catch (err) {
    res.status(404).json({ status: "image resize fail", message: err })
  }

  next()
}

exports.aliasTopTours = function (req, res, next) {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage, -price"
  req.query.fields = "name, price, ratingsAverage, summary, difficulty"
  next()
}

exports.getAllTours = commons.getAll(Tour)
exports.getTour = commons.getOne(Tour, { path: "reviews" })
exports.createTour = commons.createOne(Tour)
exports.updateTour = commons.updateOne(Tour)
exports.deleteTour = commons.deleteOne(Tour)

exports.getTourStats = async function (req, res) {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      { $sort: { avgPrice: 1 } }
      // { $match: { _id: { $ne: "EASY" } } },
    ])
    res.status(200).json({ status: "success", data: { stats } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}

exports.getMonthlyPlan = async function (req, res) {
  try {
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { month: 1 } },
      { $limit: 12 }
    ])

    res.status(200).json({ status: "success", data: { plan } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}

exports.getToursWithin = async function (req, res, next) {
  try {
    const { distance, latlng, unit } = req.params
    const [latitude, longitude] = latlng.split(",")
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1

    if (!latitude || !longitude)
      next(new appError("Please provide latitutr and longitude in the format lat,lng.", 400))

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    })
    res.status(200).json({ status: "success", results: tours.length, data: { tours } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}

exports.getDistances = async function (req, res, next) {
  try {
    const { latlng, unit } = req.params
    const [latitude, longitude] = latlng.split(",")
    const multiplier = unit === "mi" ? 0.000621371 : 0.001

    if (!latitude || !longitude)
      next(new appError("Please provide latitutr and longitude in the format lat,lng.", 400))

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude * 1, latitude * 1] },
          distanceField: "distance",
          distanceMultiplier: multiplier
        }
      },
      { $project: { distance: 1, name: 1 } }
    ])

    res.status(200).json({ status: "success", data: { data: distances } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}
