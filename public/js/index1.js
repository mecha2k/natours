import "core-js/stable"
import "regenerator-runtime/runtime"
import { displayMap } from "./mapbox"
import { login, logout } from "./login"

console.log("Hello from parcel-bundler!")

const mapBox = document.getElementById("map")
const loginForm = document.querySelector(".form")
const logOutBtn = document.querySelector(".nav-logout")

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm)
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email, password)
      .then(console.log({ email, password }))
      .catch((err) => console.log(err))
  })

if (logOutBtn) logOutBtn.addEventListener("click", logout)
