const app = require("./app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config({ path: "./.env" })

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
const localDB = process.env.DATABASE_LOCAL
mongoose
  .connect(localDB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then((connect) => {
    console.log(connect.connection)
    console.log("Database connection successful.")
  })

// app.get("/", function (req, res) {
//   // res.send("hello world")
//   res.status(200).send("Hello from the server side!")
// })
//
// app.post("/", function (req, res) {
//   res.send("Post method~")
// })

const tours = JSON.parse(fs.readFileSync("./resources/data/tours-simple.json"))

app.get("/api/tours", function(req, res) {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours }
  })
})

app.post("/api/tours", function(req, res) {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  console.log(req.body)
  tours.push(newTour)
  fs.writeFile("./resources/data/tours-simple.json", JSON.stringify(tours), (error) => {
    res.status(201).json({ status: "success", data: { tour: newTour } })
  })
})

const port = process.env.PORT || "3000"
app.listen(port, function() {
  console.log("Server App running on port: " + port)
})
