const fs = require("fs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const tourDB = require("../models/tours")

dotenv.config({ path: "./../.env" })
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
console.log(process.env.DATABASE)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connect) => {
    console.log("Database connection successful.")
  })

console.log("current path:" + `${__dirname}`)
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "UTF-8").toString())

const importData = async function () {
  try {
    await tourDB.create(tours)
    console.log("Data successfully loaded.")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

const deleteData = async function () {
  try {
    await tourDB.deleteMany()
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
