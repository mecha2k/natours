const express = require("express")
const path = require("path")
const logger = require("morgan")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const createError = require("http-errors")
const expressLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")

const tourRouter = require("./routes/tours")
const userRouter = require("./routes/users")
const reviewRouter = require("./routes/reviews")

const app = express()

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

if (process.env["NODE_ENV"] === "development") app.use(logger("dev"))

const expresslimit = expressLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
})
app.use("/api", expresslimit)

app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(mongoSanitize())
app.use(xss())
app.use(
  hpp({
    whitelist: [
      "price",
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty"
    ]
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function (req, res, next) {
  console.log("Hello from the middleware...")
  next()
})

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString()
  next()
})

app.get("/", function (req, res) {
  return res.status(200).render("index")
})

app.use("/api/tours", tourRouter)
app.use("/api/users", userRouter)
app.use("/api/reviews", reviewRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
