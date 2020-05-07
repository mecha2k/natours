# Natours Application

Built using modern technologies: node.js, express, mongoDB,
mongoose and friends 😁

##### MongoDB connection 
* Atlas Database : DB
* Local Database : localDB

~~~
  const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  const localDB = process.env.DATABASE_LOCAL
  mongoose
    .connect(localDB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then((connect) => {
      console.log(connect.connection)
      console.log("Database connection successful.")
    })
~~~