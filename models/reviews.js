const mongoose = require("mongoose")
const Tour = require("./tours")

const schema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"]
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "tours",
      required: [true, "Review must belong to a tour."]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "Review must belong to a user"]
    }
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

schema.index({ tour: 1, user: 1 }, { unique: true })

schema.pre(/^find/, function(next) {
  // this.populate({ path: "tour", select: "name" }).populate({ path: "user", select: "name photo" })
  this.populate({ path: "user", select: "name photo" })
  next()
})

schema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    { $group: { _id: "$tour", nRating: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
  ])

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    })
  }
}

schema.post("save", function() {
  this.constructor.calcAverageRatings(this.tour).then()
})

schema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne()
  next()
})

schema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour)
})

module.exports = mongoose.model("reviews", schema)
