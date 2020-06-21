const appError = require("../utils/appError")

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new appError(message, 400)
}

const handleDuplicateFieldsDB = function (err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

  const message = `Duplicate field value: ${value}. Please use another value!`
  return new appError(message, 400)
}

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((elem) => elem.message)

  const message = `Invalid input data. ${errors.join(". ")}`
  return new appError(message, 400)
}

const handleJWTError = function () {
  return new appError("Invalid token. Please log in again!", 401)
}

const handleJWTExpiredError = function () {
  return new appError("Your token has expired! Please log in again.", 401)
}

const sendErrorDev = function (err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }

  console.error("ERROR 💥", err)
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    message: err.message
  })
}

const sendErrorProd = function (err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    console.error("ERROR 💥", err)
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!"
    })
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      message: err.message
    })
  }
  console.error("ERROR 💥", err)

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    message: "Please try again later."
  })
}

module.exports = function (err, req, res, next) {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err }
    error.message = err.message

    if (error.name === "CastError") error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === "ValidationError") error = handleValidationErrorDB(error)
    if (error.name === "JsonWebTokenError") error = handleJWTError()
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError()

    sendErrorProd(error, req, res)
  }
}
