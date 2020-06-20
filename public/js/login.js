// const axios = require("axios")
// import axios from "axios"
// import { showAlert } from "./alerts"

const login = async function(email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/users/login",
      data: {
        email,
        password
      }
    })
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err))

    if (res.data.status === "success") {
      alert("Logged in successfully!")
      window.setTimeout(function() {
        location.assign("/")
      }, 100)
    }
    console.log(res)
  } catch (err) {
    alert(err.response.data.message)
    console.log(err.response.data.message)
    // message : Incorrect email or password (need to correct!)
  }
}

const logout = async function() {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout"
    })
    if ((res.data.status = "success")) location.reload(true)
  } catch (err) {
    console.log(err.response)
    alert("Error logging out! Try again.")
  }
}

const loginForm = document.querySelector(".form")

if (loginForm)
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email, password)
      .then(console.log({ email, password }))
      .catch((err) => console.log(err))
  })
