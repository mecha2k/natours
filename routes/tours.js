const express = require("express")
const fs = require("fs")

const router = express.Router()

const tours = JSON.parse(fs.readFileSync("./resources/data/tours-simple.json").toString())

const getAllTours = function(req, res) {
  console.log(req.requestTime)

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  })
}

const getTour = function(req, res) {
  console.log(req.params)
  const id = req.params.id * 1
  const tour = tours.find(function(elem) {
    return elem.id === id
  })

  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })

  res.status(200).json({ status: "success", data: { tour } })
}

const createTour = function(req, res) {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  console.log(req.body)
  tours.push(newTour)
  fs.writeFile("./resources/data/tours-simple.json", JSON.stringify(tours), (error) => {
    res.status(201).json({ status: "success", data: { tour: newTour } })
  })
}

const updateTour = function(req, res) {
  console.log(req.params)
  const id = req.params.id * 1
  if (id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })

  res.status(200).json({
    status: "success",
    data: { tour: "<Updated tour here...>" }
  })
}

const deleteTour = function(req, res) {
  console.log(req.params)
  const id = req.params.id * 1
  if (id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })

  res.status(204).json({
    status: "success",
    data: { tour: null }
  })
}

router
  .route("/")
  .get(getAllTours)
  .post(createTour)

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router
