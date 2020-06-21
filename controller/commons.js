const appError = require("../utils/apperror")
const apiFeatures = require("../utils/apiFeatures")

exports.deleteOne = function (model) {
  return async function (req, res, next) {
    console.log(req.params)

    try {
      const doc = await model.findByIdAndDelete(req.params.id)
      if (!doc) return next(new appError("No document found with that ID", 404))

      res.status(204).json({ status: "success", data: null })
    } catch (error) {
      res.status(404).json({ status: "fail", message: error })
    }
  }
}

exports.updateOne = function (model) {
  return async function (req, res, next) {
    try {
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })
      if (!doc) return next(new appError("No document found with that ID", 404))

      res.status(200).json({ status: "success", data: { doc } })
    } catch (error) {
      res.status(404).json({ status: "fail", message: error })
    }
  }
}

exports.createOne = function (model) {
  return async function (req, res, next) {
    try {
      const doc = await model.create(req.body)

      res.status(200).json({ status: "success", data: { doc } })
    } catch (error) {
      res.status(404).json({ status: "fail", message: error })
    }
  }
}

exports.getOne = function (model, popOpts) {
  return async function (req, res, next) {
    try {
      let query = model.findById(req.params.id)
      if (popOpts) query = query.populate(popOpts)
      const doc = await query

      if (!doc) return next(new appError("No document found with that ID", 404))

      res.status(200).json({ status: "success", data: { doc } })
    } catch (error) {
      res.status(404).json({ status: "fail", message: error })
    }
  }
}

exports.getAll = function (model) {
  return async function (req, res, next) {
    try {
      let filter = {}
      if (req.params.id) filter = { tour: req.params.id }

      const features = new apiFeatures(model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
      const doc = await features.queryDB

      res.status(200).json({ status: "success", results: doc.length, data: { doc } })
    } catch (error) {
      res.status(404).json({ status: "fail", message: error })
    }
  }
}
