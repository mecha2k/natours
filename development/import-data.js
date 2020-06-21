const fs = require("fs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const Tour = require("../models/tours")
const User = require("../models/users")
const Review = require("../models/reviews")

dotenv.config()
console.log(process.env["DATABASE"])
const DB = process.env["DATABASE"].replace("<PASSWORD>", process.env["DATABASE_PASSWORD"])

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((connect) => {
    console.log("Database connection successful.")
  })

console.log("current path:" + `${__dirname}`)
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "UTF-8").toString())
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "UTF-8").toString())
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "UTF-8").toString())

const importData = async function () {
  try {
    await Tour.create(tours)
    await User.create(users, { validateBeforeSave: false })
    await Review.create(reviews)
    console.log("Data successfully loaded.")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

const deleteData = async function () {
  try {
    await Tour.deleteMany({})
    await User.deleteMany({})
    await Review.deleteMany({})

    console.log("Data successfully deleted.")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

console.log(process.argv[2])

if (process.argv[2] === "--import") {
  importData().then()
} else if (process.argv[2] === "--delete") {
  deleteData().then()
}
