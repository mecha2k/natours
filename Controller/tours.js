const tourDB = require("../models/tours")
const APIFeatures = require("apiFeatures")

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,summary,difficulty"
  next()
}

exports.getAllTours = async function (req, res) {
  try {
    const features = new APIFeatures(tourDB.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const tours = await features.query

    res.status(200).json({
      status: "success",
      results: tours.length,
      requestedAt: req.requestTime,
      data: { tours },
    })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.getTour = async function (req, res) {
  console.log(req.params.id)
  try {
    const tour = await tourDB.findById(req.params.id)
    // const tour = await tourDB.findOne({ _id: req.params.id })

    res.status(200).json({ status: "success", data: { tour } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.createTour = async function (req, res) {
  try {
    // const newTour = new tour({})
    // newTour.save()

    console.log(req.body)
    const newTour = await tourDB.create(req.body)

    res.status(201).json({ status: "success", data: { tour: newTour } })
  } catch (error) {
    res.status(400).json({ status: "fail", message: error })
  }
}

exports.updateTour = async function (req, res) {
  console.log(req.params)

  try {
    const tour = await tourDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ status: "success", data: { tour } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.deleteTour = async function (req, res) {
  console.log(req.params)

  try {
    const tour = await tourDB.findByIdAndDelete(req.params.id)

    res.status(204).json({ status: "success", data: null })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    const stats = await tourDB.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: "EASY" } } },
    ])

    res.status(200).json({ status: "success", data: { stats } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1 // 2021

    const plan = await tourDB.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ])

    res.status(200).json({ status: "success", data: { plan } })
  } catch (err) {
    res.status(404).json({ status: "fail", message: err })
  }
}
