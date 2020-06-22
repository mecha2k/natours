import "core-js/stable"
import "regenerator-runtime/runtime"
import { displayMap } from "./mapbox"
import { login, logout } from "./login"
import { updateuser } from "./updateuser"
// import { bookTour } from "./stripe"
import { showAlert } from "./alerts"

console.log("Hello from parcel-bundler!")

const mapBox = document.getElementById("map")
const loginForm = document.querySelector(".form-login")
const logOutBtn = document.querySelector(".nav-logout")
const userDataForm = document.querySelector(".form-user-data")
const userPasswordForm = document.querySelector(".form-user-password")
const bookBtn = document.getElementById("book-tour")

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

if (userDataForm)
  userDataForm.addEventListener("submit", function (e) {
    e.preventDefault()
    // const form = new FormData()
    // form.append("name", document.getElementById("name").value)
    // form.append("email", document.getElementById("email").value)
    // form.append("photo", document.getElementById("photo").files[0])
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value

    updateuser({ name, email }, "data").then(console.log({ name, email }))
  })

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault()
    document.querySelector(".btn-save-password").textContent = "Updating..."

    const passwordCurrent = document.getElementById("password-current").value
    const password = document.getElementById("password").value
    const passwordConfirm = document.getElementById("password-confirm").value
    await updateuser({ passwordCurrent, password, passwordConfirm }, "password")

    document.querySelector(".btn-save-password").textContent = "Save password"
    document.getElementById("password-current").value = ""
    document.getElementById("password").value = ""
    document.getElementById("password-confirm").value = ""
  })

// if (bookBtn)
//   bookBtn.addEventListener("click", (e) => {
//     e.target.textContent = "Processing..."
//     const { tourId } = e.target.dataset
//     bookTour(tourId).then()
//   })

const alertMessage = document.querySelector("body").dataset.alert
if (alertMessage) showAlert("success", alertMessage, 20)
