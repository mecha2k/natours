class APIFeatures {
  constructor(queryDB, querystring) {
    this.queryDB = queryDB
    this.querystring = querystring
  }

  filter() {
    const queryObj = { ...this.querystring }
    const exFields = ["page", "sort", "limit", "fields"]
    exFields.forEach((elem) => delete queryObj[elem])

    let querystr = JSON.stringify(queryObj)
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    console.log(JSON.parse(querystr))

    this.queryDB = this.queryDB.find(JSON.parse(querystr))

    return this
  }

  sort() {
    if (this.querystring.sort) {
      const sortBy = this.querystring.sort.split(",").join(" ")
      this.queryDB = this.queryDB.sort(sortBy)
    } else {
      this.queryDB = this.queryDB.sort("-createdAt")
    }

    return this
  }

  limitFields() {
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(",").join(" ")
      this.queryDB = this.queryDB.select(fields)
    } else {
      this.queryDB = this.queryDB.select("-__v")
    }

    return this
  }

  paginate() {
    const page = this.querystring.page * 1 || 1
    const limit = this.querystring.limit * 1 || 100
    const skip = (page - 1) * limit

    this.queryDB = this.queryDB.skip(skip).limit(limit)

    return this
  }
}

export default APIFeatures
