const mongoose = require("mongoose")
const { isEmail } = require("validator")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

const schema = new mongoose.Schema({
  name: { type: String, required: [true, "Please tell us your name"] },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please provide your email"]
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function(elem) {
        return elem === this.password
      },
      message: "Passwords are not the same!"
    }
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false
  }
})

schema.pre("save", async function(next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 10)
  this.passwordConfirm = undefined
  next()
})

schema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

schema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})

schema.methods.comparePasswd = async function(candidate, user) {
  return await bcrypt.compare(candidate, user)
}

schema.methods.changedPasswd = function(JWTTimestamp) {
  if (this["passwordChangedAt"]) {
    const changedTimestamp = parseInt(this["passwordChangedAt"].getTime() / 1000, 10)

    return JWTTimestamp < changedTimestamp
  }

  return false
}

schema.methods.createPasswdResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  console.log({ resetToken })
  console.log(this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model("users", schema)
