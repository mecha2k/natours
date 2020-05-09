const app = require("./app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({ path: "./.env" })

// const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
// const localDB = process.env.DATABASE_LOCAL
// mongoose
//   .connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
//   .then((connect) => {
//     console.log(connect.connection)
//     console.log("Database connection successful.")
//   })
//
// const tourSchema = new mongoose.Schema({
//   name: { type: String, required: [true, "A tour must have a name"], unique: true },
//   rating: { type: Number, default: 4.5 },
//   price: { type: Number, required: [true, "A tour must have a price"] }
// })
// const Tour = mongoose.model("Tour", tourSchema)
//
// const testTour = new Tour({
//   name: "The Park Camper",
//   price: 975
// })
//
// testTour
//   .save()
//   .then(function(doc) {
//     console.log(doc)
//   })
//   .catch(function(err) {
//     console.log("ERROR :", err)
//   })

// app.get("/", function (req, res) {
//   // res.send("hello world")
//   res.status(200).send("Hello from the server side!")
// })
//
// app.post("/", function (req, res) {
//   res.send("Post method~")
// })

app.use(function(req, res, next) {
  console.log("Hello from the middleware...")
  next()
})

app.use(function(req, res, next) {
  req.requestTime = new Date().toISOString()
  next()
})

// app.get("/api/tours", getAllTours)
// app.get("/api/tours/:id", getTour)
// app.post("/api/tours", createTour)
// app.patch("/api/tours/:id", updateTour)
// app.delete("/api/tours/:id", deleteTour)

// app
//   .route("/api/tours")
//   .get(getAllTours)
//   .post(createTour)
// app
//   .route("/api/tours/:id")
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour)

const port = process.env.PORT || "3000"
app.listen(port, function() {
  console.log("Server App running on port: " + port)
})
