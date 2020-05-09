const fs = require("fs")

const tours = JSON.parse(fs.readFileSync("./resources/data/tours-simple.json").toString())

exports.checkID = function(req, res, next, val) {
  console.log(`Tour ID is: ${val}`)
  const id = req.params.id * 1

  if (id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })

  next()
}

exports.checkBody = function(req, res, next) {
  console.log(req.body)
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price"
    })

  next()
}

exports.getAllTours = function(req, res) {
  console.log(req.requestTime)

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  })
}

exports.getTour = function(req, res) {
  console.log(req.params)
  const id = req.params.id * 1
  const tour = tours.find(function(elem) {
    return elem.id === id
  })

  res.status(200).json({ status: "success", data: { tour } })
}

exports.createTour = function(req, res) {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  console.log(req.body)
  tours.push(newTour)
  fs.writeFile("./resources/data/tours-simple.json", JSON.stringify(tours), (error) => {
    res.status(201).json({ status: "success", data: { tour: newTour } })
  })
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
    status: "success",
    data: { tour: null }
  })
}
