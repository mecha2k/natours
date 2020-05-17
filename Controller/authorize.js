const User = require("../models/users")

exports.signup = async function(req, res, next) {
  const newuser = await User.create(req.body)

  res.status(201).json({ status: "success", data: { user: newuser } })
}
