const fs = require('fs');
const PImage = require('pureimage');
const Planet = require("./Planet.js");

let colors = {
    land_color: "#4cfa69",
    beach_color: "#e9fe6d",
    ocean_color: "#78dffb",
    mountain_color: "#854d1d",
    mountain_top_color: "#ffffff",
    cloud_color: "#ffffff",
    cloud_opacity: 70,
    atmosphere_color: "#4F7AAD",
    atmosphere_opacity: 40,
    add_detail: true,
}
let planet_options = {
    planet_radius: 400,
    atmosphere_radius: 600,
    sea_level: 0.45,
    beach_level: 0.5,
    mountain_level: 0.62,
    mountain_top_level: 0.75,
    cloud_level: 0.62,
    cloud_radius: 420,
}

let generator_options = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let cloud_generator = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let size = 1000;

let image = Planet.generatePlanet(size, planet_options, colors, true, true, generator_options, cloud_generator);

//TEST EXPORT
PImage.encodePNGToStream(image, fs.createWriteStream('out.png')).then(() => {
    console.log("wrote out the png file to out.png");
}).catch((e)=>{
    console.log("there was an error writing");
});