import axios from "axios"
import { showAlert } from "./alerts"

export const updateData = async function(data, type) {
  try {
    const url = type === "password" ? "/api/users/updateMyPassword" : "/api/users/updateMe"

    const res = await axios({
      method: "PATCH",
      url,
      data
    })

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert("error", err.response.data.message)
  }
}
