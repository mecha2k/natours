const app = require("./app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

console.log(app.get("env"))
dotenv.config({ path: "./.env" })

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
const localDB = process.env.DATABASE_LOCAL
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connect) => {
    // console.log(connect.connection)
    console.log("Database connection successful.")
  })

const port = process.env.PORT || "3000"
app.listen(port, function () {
  console.log("Server App running on port: " + port)
})

// app.get("/", function (req, res) {
//   // res.send("hello world")
//   res.status(200).send("Hello from the server side!")
// })
//
// app.post("/", function (req, res) {
//   res.send("Post method~")
// })

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

// const testTour = new Tour({
//   name: "The Forest Hiker",
//   price: 497
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
