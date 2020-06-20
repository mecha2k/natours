// const axios = require("axios")
import axios from "axios"
import { showAlert } from "./alerts"

export const login = async function (email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/users/login",
      data: {
        email,
        password
      }
    })

    // if (res.data.status === "success") {
    //   showAlert("success", "Logged in successfully!")
    //   window.setTimeout(function () {
    //     location.assign("/")
    //   }, 1500)
    // }
    console.log(res)
  } catch (err) {
    // showAlert("error", err.response.data.message)
    console.log(err.response.message)
  }
}
//
// export const logout = async function () {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "/api/v1/users/logout"
//     })
//     if ((res.data.status = "success")) location.reload(true)
//   } catch (err) {
//     console.log(err.response)
//     showAlert("error", "Error logging out! Try again.")
//   }
// }

// const login = function (email, password) {
//   alert({email, password})
//   console.log(email)
//   console.log(password)
// }

const loginForm = document.querySelector(".form")

if (loginForm)
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email, password).then(console.log({ email, password }))
  })
