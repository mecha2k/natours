# Natours Application

Built using modern technologies: node.js, express, mongoDB,
mongoose and friends 😁

##### Node.js & Express
* Express : fully wraped node.js server


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