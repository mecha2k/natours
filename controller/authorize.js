const crypto = require("crypto")
const { promisify } = require("util")
const jwt = require("jsonwebtoken")

const User = require("../models/users")
const sendEmail = require("./email")
const appError = require("./apperror")

const createToken = function(id) {
  return jwt.sign({ id }, process.env["JWT_HASHCODE"], {
    expiresIn: process.env["JWT_EXPIRES_IN"]
  })
}

const saveTokenInCookie = function(user, status, res) {
  const token = createToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env["JWT_COOKIE_EXPIRES_IN"] * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (process.env["NODE_ENV"] === "production") cookieOptions.secure = true

  res.cookie("jwt", token, cookieOptions)
  user.password = undefined

  res.status(status).json({ status: "success", token, data: { user } })

  return token
}

exports.signup = async function(req, res, next) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role
    })

    saveTokenInCookie(newUser, 201, res)
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.login = async function(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) return next(new appError("Please provide email and password!", 400))

    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.comparePasswd(password, user.password))) {
      return next(new appError("Incorrect email or password", 401))
    }

    const token = saveTokenInCookie(user, 200, res)
    console.log(user)

    res.status(200).json({ status: "success", token, data: { user } })
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }
}

exports.protect = async function(req, res, next) {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
      return next(new appError("You are not logged in! Please log in to get access.", 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env["JWT_HASHCODE"])
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      return next(new appError("The user belonging to this token does no longer exist.", 401))
    }
    if (currentUser.changedPasswd(decoded.iat)) {
      return next(new appError("User recently changed password! Please log in again.", 401))
    }

    req.user = currentUser
  } catch (error) {
    res.status(404).json({ status: "fail", message: error })
  }

  next()
}

exports.restrictTo = function(...roles) {
  return function(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new appError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

exports.forgotPassword = async function(req, res, next) {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new appError("There is no user with email address.", 404))
  }

  const resetToken = user.createPasswdResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`
  const message = `Forgot your password? 
    Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n
    If you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message
    })

    res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new appError("There was an error sending the email. Try again later!"), 500)
  }
}

exports.resetPassword = async function(req, res, next) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  if (!user) {
    return next(new appError("Token is invalid or has expired", 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  saveTokenInCookie(user, 200, res)
}

exports.updatePassword = async function(req, res, next) {
  const user = await User.findById(req.user.id).select("+password")

  if (!(await user.comparePasswd(req.body.passwordCurrent, user.password))) {
    return next(new appError("Your current password is wrong.", 401))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  saveTokenInCookie(user, 200, res)
}

exports.isLoggedIn = async function(req, res, next) {
  // if (req.cookies.jwt) {
  //   try {
  //     const decoded = await promisify(jwt.verify)(
  //         req.cookies.jwt,
  //         process.env['JWT_HASHCODE']
  //     );
  //
  //     const currentUser = await User.findById(decoded.id);
  //     if (!currentUser) {
  //       return next();
  //     }
  //
  //     if (currentUser.changedPasswordAfter(decoded.iat)) {
  //       return next();
  //     }
  //
  //     // THERE IS A LOGGED IN USER
  //     res.locals.user = currentUser;
  //     return next();
  //   } catch (error) {
  //     return next();
  //   }
  // }
  next()
}
