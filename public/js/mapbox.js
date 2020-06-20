export const displayMap = function(locations) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWVjaGEyayIsImEiOiJja2Jia29xanEwMXBlMnhuMDVmMzhidHI0In0.rCYv8XnHhi68LKx0Mk0sBg"

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mecha2k/ckbbv3buk08b11ipm1h7jjie6",
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  })

  const bounds = new mapboxgl.LngLatBounds()
  console.log(locations)

  locations.forEach(function(loc) {
    const element = document.createElement("div")
    element.className = "marker"

    new mapboxgl.Marker({ element: element, anchor: "bottom" })
      .setLngLat(loc.coordinates)
      .addTo(map)

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, { padding: { top: 200, bottom: 150, left: 100, right: 100 } })
}

// mapboxgl.accessToken =
//   "pk.eyJ1IjoibWVjaGEyayIsImEiOiJja2Jia29xanEwMXBlMnhuMDVmMzhidHI0In0.rCYv8XnHhi68LKx0Mk0sBg"
//
// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mecha2k/ckbbv3buk08b11ipm1h7jjie6",
//   scrollZoom: false
//   // center: [-118.113491, 34.111745],
//   // zoom: 10,
//   // interactive: false
// })

// const locations = JSON.parse(document.getElementById("map").dataset.locations)
// const bounds = new mapboxgl.LngLatBounds()
// console.log(locations)
//
// locations.forEach(function(loc) {
//   const element = document.createElement("div")
//   element.className = "marker"
//
//   new mapboxgl.Marker({ element: element, anchor: "bottom" }).setLngLat(loc.coordinates).addTo(map)
//
//   new mapboxgl.Popup({ offset: 30 })
//     .setLngLat(loc.coordinates)
//     .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
//     .addTo(map)
//
//   bounds.extend(loc.coordinates)
// })
//
// map.fitBounds(bounds, { padding: { top: 200, bottom: 150, left: 100, right: 100 } })
