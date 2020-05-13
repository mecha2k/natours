const mongoose = require("mongoose")
const slugify = require("slugify")

const shema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A tour must have a name"], unique: true, trim: true },
    duration: { type: Number, required: [true, "A tour must have a duration"] },
    maxGroupSize: { type: Number, required: [true, "A tour must have a group size"] },
    difficulty: { type: String, required: [true, "A tour must have a difficulty"] },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    slug: String,
    price: { type: Number, required: [true, "A tour must have a price"] },
    priceDiscount: Number,
    summary: { type: String, trim: true, required: [true, "A tour must have a summary"] },
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, "A tour must have a cover image"] },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

shema.virtual("durationWeeks").get(function () {
  return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
shema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// shema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// shema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: shema.pre('find', function(next) {
shema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })

  this.start = Date.now()
  next()
})

shema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  next()
})

// AGGREGATION MIDDLEWARE
shema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model("Tour", shema)

module.exports = Tour
