import axios from "axios"
import { showAlert } from "./alerts"

export const login = async function(email, password) {
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
      showAlert("success", "Logged in successfully!")
      window.setTimeout(function() {
        location.assign("/")
      }, 100)
    }
    console.log(res)
  } catch (err) {
    showAlert("error", err.response.data.message)
    console.log(err.response.data.message)
    // message : Incorrect email or password (need to correct!)
  }
}

export const logout = async function() {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/users/logout"
    })
    if ((res.data.status = "success")) location.reload(true)
  } catch (err) {
    console.log(err.response)
    showAlert("error", "Error logging out! Try again.")
  }
}
