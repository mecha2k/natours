# Natours Application

Built using modern technologies: node.js, express, mongoDB,
mongoose and friends 😁

##### Express
* a minimal node.js framework, a higher level of abstraction
* robust set of features: complex routing, easier handling of requests and responses, middleware, server-side rendering
* makes it easier to organize our application into the MVC architecture


##### MongoDB connection 
* Atlas Database : DB
* Local Database : localDB
* Changing database name from 'test' to 'natours'
* Password is saved in '.env' file

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