const mongoose = require("mongoose")
const dotenv = require("dotenv")

process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...")
  console.log(err.name, err.message)
  process.exit(1)
})

console.log(app.get("env"))
dotenv.config({ path: "./.env" })

const app = require("./app")

const DB = process.env["DATABASE"].replace("<PASSWORD>", process.env["DATABASE_PASSWORD"])
const localDB = process.env["DATABASE_LOCAL"]
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((connect) => {
    // console.log(connect.connection)
    console.log("Database connection successful.")
  })

const port = process.env["PORT"] || "3000"
app.listen(port, function () {
  console.log("Server App running on port: " + port)
})

process.on("unhandledRejection", function (err) {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...")
  console.log(err.name, err.message)
  app.close(function () {
    process.exit(1)
  })
})
