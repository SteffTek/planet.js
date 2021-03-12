let colors = {
    land_color: "#585858",
    beach_color: "#404040",
    shore_color: "#303030",
    ocean_color: "#181818",
    mountain_color: "#606060",
    mountain_top_color: "#606060",
    crater_color: "#303030",
    cloud_color: "#ffffff",
    cloud_opacity: 70,
    atmosphere_color: "#eae1ee",
    atmosphere_opacity: 40,
    shading_level: 1,
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
    cloud_radius: 82,
    craters: true,
    clouds: false,
    atmosphere: false
}

let generator_options = {
    octaveCount: 6,
    amplitude: 3,
    persistence: 0.5
}

let cloud_generator = {
    octaveCount: 6,
    amplitude: 6,
    persistence: 0.4
}

let size = 200;

//AND ATMOSPHERE AND CLOUDS SET TO FALSE