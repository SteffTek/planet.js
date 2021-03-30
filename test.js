const fs = require('fs');
const PImage = require('pureimage');
const Planet = require("./Planet.js");

let colors = {
    land_color: "#228747",
    beach_color: "#e9fe6d",
    shore_color: "#78dffb",
    ocean_color: "#0744a6",
    mountain_color: "#854d1d",
    mountain_top_color: "#ffffff",
    crater_color: "#8b9e90",
    pole_color: "#ffffff",
    cloud_color: "#ffffff",
    cloud_opacity: 70,
    atmosphere_color: "#4F7AAD",
    atmosphere_opacity: 70,
    shading_level: 0.9,
    add_detail: true,
}
let planet_options = {
    planet_radius: 80,
    atmosphere_radius: 95,
    sea_level: 0.42,
    shore_level: 0.45,
    beach_level: 0.46,
    mountain_level: 0.62,
    mountain_top_level: 0.75,
    cloud_level: 0.62,
    cloud_radius: 85,
    pole_level: 0.25,
    craters: false,
    clouds: true,
    atmosphere: true,
    poles: true,
    hard_pole_lines: true,
}

let generator_options = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let cloud_generator = {
    octaveCount: 6,
    amplitude: 6,
    persistence: 0.4
}

let sun_options = {
    star_radius: 400,
    radiation_radius: 600,
    radiation: true,
    blind_spot_level: 0.9
}

let sun_colors = {
    color: "#ffe8d5",
    radiation_color: "#c98b2e",
    blind_spot_color: "#3b2600",
    radiation_opacity: 40,
    add_detail: true,
    blind_spots: true,
}

let blind_spots = {
    octaveCount: 9,
    amplitude: 3,
    persistence: 0.5
}

let gasOptions = {
    giants_radius: 400,
    giants_atmosphere: 600,
    atmosphere: true,
    eyes: true
}

let gasColors = {
    base_color: "#edcab2",
    colors: [
        '#5a7b81', '#597a80',
        '#5e7c82', '#60b3bf',
        '#70789d', '#5b6280',
        '#cfd4e6', '#6375bf',
        '#6e9d74'
      ],
    atmosphere_color: "#edcab2",
    eye_color: "#d93a00",
    atmosphere_opacity: 70,
    shading_level: 2,
    add_detail: true,
}

let size = 200;
let seed = "Clara";

//let image = Planet.generateGasGiant(size, gasOptions, gasColors, seed);
let image = Planet.generatePlanet(size, planet_options, colors, null, generator_options, cloud_generator);
//let image = Planet.generateStar(size, sun_options, sun_colors, seed, generator_options, blind_spots);

image = Planet.rotate(image, 30);

Planet.save(image,"out.png");