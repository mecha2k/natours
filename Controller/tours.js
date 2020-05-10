const tourDB = require("../models/tours")

exports.getAllTours = async function(req, res) {
  console.log(req.requestTime)

  try {
    const tours = await tourDB.find()

    res.status(200).json({
      status: "success",
      results: tours.length,
      requestedAt: req.requestTime,
      data: { tours }
    })
  } catch (error) {
    res.status(400).json({ status: "fail", message: error })
  }
}

exports.getTour = async function(req, res) {
  try {
    const tour = await tourDB.findById(req.params.id)
    // const tour = await tourDB.findOne({ _id: req.params.id })

    res.status(200).json({ status: "success", data: { tour } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.createTour = async function(req, res) {
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

exports.updateTour = function(req, res) {
  console.log(req.params)

  res.status(200).json({
    status: "success",
    data: { tour: "<Updated tour here...>" }
  })
}

exports.deleteTour = function(req, res) {
  console.log(req.params)

  res.status(204).json({
    status: "success"
    // data: { tour: null }
  })
}
