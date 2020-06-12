const Tour = require("../models/tours")
const User = require("../models/users")
const Booking = require("../models/booking")
const appError = require("./apperror")

exports.alerts = function (req, res, next) {
  const { alert } = req.query
  if (alert === "booking")
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. " +
      "If your booking doesn't show up here immediatly, please come back later."
  next()
}

exports.getTours = async function (req, res, next) {
  const tours = await Tour.find()

  res.status(200).render("index", { title: "All Tours", tours })
  console.log(tours[0].startLocation.description)
  console.log(tours[0].guides)
}

exports.getTour = async function (req, res, next) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  })

  if (!tour) return next(new appError("There is no tour with that name.", 404))

  res.status(200).render("tour", { title: `${tour.name} Tour`, tour })
}

exports.getLoginForm = function (req, res) {
  res.status(200).render("login", {
    title: "Log into your account"
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  })
}

exports.getMyTours = async function (req, res, next) {
  const bookings = await Booking.find({ user: req.user.id })

  const tourIDs = bookings.map((el) => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })

  res.status(200).render("index", { title: "My Tours", tours })
}

exports.updateUserData = async function (req, res, next) {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  )

  res.status(200).render("account", { title: "Your account", user: updatedUser })
}
