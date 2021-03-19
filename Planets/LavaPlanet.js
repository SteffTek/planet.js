let colors = {
    land_color: "#661111",
    beach_color: "#9e1b1b",
    shore_color: "#cf1f1f",
    ocean_color: "#ff1414",
    mountain_color: "#522e29",
    mountain_top_color: "#000000",
    crater_color: "#853d3d",
    cloud_color: "#1f0505",
    cloud_opacity: 70,
    atmosphere_color: "#4F7AAD",
    atmosphere_opacity: 70,
    shading_level: 1.2,
    add_detail: true,
}
let planet_options = {
    planet_radius: 80,
    atmosphere_radius: 100,
    sea_level: 0.42,
    shore_level: 0.48,
    beach_level: 0.5,
    mountain_level: 0.62,
    mountain_top_level: 0.75,
    cloud_level: 0.62,
    cloud_radius: 85,
    craters: false,
    clouds: true,
    atmosphere: true
}

let generator_options = {
    octaveCount: 6,
    amplitude: 2,
    persistence: 0.5
}

let cloud_generator = {
    octaveCount: 6,
    amplitude: 6,
    persistence: 0.4
}

let size = 200;