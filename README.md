# planet.js
## Procedural generated 2D planets in NodeJS.

![OverWorld.png](https://raw.githubusercontent.com/SteffTek/planet.js/main/Overworld.png)

# Installation
```
npm install git+https://github.com/SteffTek/planet.js
```

# Other Planets
![GreenPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/GreenPlanet.png "GreenPlanet") ![AlienPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/AlienPlanet.png "AlienPlanet") ![Moon](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/Moon.png "Moon")

# Usage
```js
const Planet = require("planet.js");

[...]

/*
    Planet.js returns an PureImage Image

    Parameters: - imageSize
                - planetOptions
                - planetColors

    Optional:   - hasClouds
                - hasAtmosphere
                - generatorOptions
                - cloudGeneratorOptions
*/
let image Planet.generatePlanet([...]);

/*
    Export with PureImage
*/
PImage.encodePNGToStream(image, fs.createWriteStream('out.png')).then(() => {
    console.log("wrote out the png file to out.png");
}).catch((e)=>{
    console.log("there was an error writing");
});
```

# Example Options
Example options for an OverWorld-Planet like in the preview above.
```js
let colors = {
    land_color: "#4cfa69",              //Color of the Main Land
    beach_color: "#e9fe6d",             //Color of the Beaches
    shore_color: "#78dffb",             //Color of the Shores
    ocean_color: "#0744a6",             //Color of the Deep Ocean
    mountain_color: "#854d1d",          //Color of the Mountains
    mountain_top_color: "#ffffff",      //Color of the Mountain Top (e.g. Snow)
    cloud_color: "#ffffff",             //Cloud Color
    cloud_opacity: 70,                  //Cloud Base Opacity
    atmosphere_color: "#4F7AAD",        //Atmosphere Color
    atmosphere_opacity: 40,             //Atmosphere Opacity/Density
    add_detail: true,                   //Plain Map or a bit more detailed?
}
let planet_options = {
    planet_radius: 400,                 //Planet Radius
    atmosphere_radius: 600,             //Atmosphere Radius
    sea_level: 0.42,                    // ALL LEVELS ARE VALUES BETWEEN 0 AND 1
    shore_level: 0.48,
    beach_level: 0.5,
    mountain_level: 0.62,
    mountain_top_level: 0.75,
    cloud_level: 0.62,                  // CLOUD LEVEL IS CUSTOM GENERATED AND NOT AFFECTED BY THE OTHER LEVELS
    cloud_radius: 420,                  //Cloud Radius
}

let generator_options = {
    octaveCount: 9,                     //Perlin Noise Octave (How Often)
    amplitude: 5,                       //Perlin Noise Amp (How Big)
    persistence: 0.5                    //Perlin Noise persistence (How Smooth, smaller number = smoother)
}

let cloud_generator = {
    octaveCount: 6,
    amplitude: 6,
    persistence: 0.4
}

let size = 1000; //Control the ImageSize

let image = Planet.generatePlanet(size, planet_options, colors, true, true, generator_options, cloud_generator);
```