let colors = {
    land_color: "#dbab25",
    beach_color: "#d9af27",
    shore_color: "#facd3c",
    ocean_color: "#b0890c",
    mountain_color: "#6e5512",
    mountain_top_color: "#383838",
    crater_color: "#853d3d",
    cloud_color: "#dbbe70",
    cloud_opacity: 70,
    atmosphere_color: "#eddbab",
    atmosphere_opacity: 70,
    shading_level: 1.2,
    add_detail: true,
}
let planet_options = {
    planet_radius: 80,
    atmosphere_radius: 100,
    sea_level: 0,
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