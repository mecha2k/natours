const fs = require("fs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const tourDB = require("../models/tours")

dotenv.config({ path: "./.env" })
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

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

const tours = JSON.parse(fs.readFileSync("../resources/data/tours-simple.json", "UTF-8").toString())

const importData = async function() {
  try {
    await tourDB.create(tours)
    console.log("Data successfully loaded.")
  } catch (error) {
    console.log(error)
  }
}

const deleteData = async function() {
  try {
    await tourDB.deleteMany()
    console.log("Data successfully deleted.")
  } catch (error) {
    console.log(error)
  }
}

console.log(process.argv)

if (process.argv[2] === "--import") {
  importData()
} else if (process.argv[2] === "--delete") {
  deleteData()
}
