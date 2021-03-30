# Planet.js
## Procedural generated 2D planets in NodeJS.
[![Discord](https://img.shields.io/discord/803319138260090910?color=%237289DA&label=Discord)](https://discord.gg/Qgv8DSMYM3) [![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/stefftek/planet.js)](https://github.com/SteffTek/planet.js) [![GitHub issues](https://img.shields.io/github/issues/stefftek/planet.js)](https://github.com/SteffTek/planet.js/issues)

If you ever wanted to create 2D procedural planets in NodeJS.... Why would you?

![Preview.png](https://raw.githubusercontent.com/SteffTek/planet.js/main/Preview.png "Preview.png")

# About
**Planets.js** was created to help a friend of mine - Clara - with her game she creates in NodeJS as a discord bot. She asked me, if I know a tool to generate Planets inside NodeJS as 2D image. Well, as you can see I nearly died of __f***ing boredom__, so Planet.js was created!

# Installation
```
npm i @stefftek/planet.js
```

# Other Planets
![GreenPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/GreenPlanet.png "GreenPlanet") ![AlienPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/AlienPlanet.png "AlienPlanet") ![Gas Giant](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/Moon.png "Moon") ![Gas Giant](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/GasGiant.png "Gas Giant") ![Sun](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/Sun.png "Sun") ![Blue Star](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/BlueStar.png "Blue Star") ![Craters](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/Craters.png "Craters") ![DesertPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/DesertPlanet.png "DesertPlanet") ![LavaPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/LavaPlanet.png "LavaPlanet") ![RockPlanet](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/RockPlanet.png "RockPlanet") ![Poles](https://raw.githubusercontent.com/SteffTek/planet.js/main/Planets/Poles.png "Poles")

# ⚠ WARNING ⚠
## With __bigger Images Sizes__ the processing becomes evermore intense and time consuming.
## __And__ - Please check that your planets radius is half the image size at max, else errors may crash the generation.
Things might not be _that_ stable...

# Usage
```js
const Planet = require("@stefftek/planet.js");

[...]

/*
    Planet.js returns an PureImage Image

    Parameters: - imageSize
                - planetOptions
                - planetColors

    Optional:   - generatorOptions
                - cloudGeneratorOptions
*/
let image = Planet.generatePlanet([...]);

/*
    Rotation
*/
image = Planet.rotate(image, 45 /*Degrees*/);

/*
    Export with PureImage
*/
Planet.save(image, "Planet.png") //Image Object and Path
```

# Example Options
## Overworld Planet
```js
let colors = {
    land_color: "#4cfa69",              //Color of the Main Land
    beach_color: "#e9fe6d",             //Color of the Beaches
    shore_color: "#78dffb",             //Color of the Shores
    ocean_color: "#0744a6",             //Color of the Deep Ocean
    mountain_color: "#854d1d",          //Color of the Mountains
    mountain_top_color: "#ffffff",      //Color of the Mountain Top (e.g. Snow)
    crater_color: "#8b9e90",            //Main Color of Craters
    pole_color: "#BDDEEC",              //Color of Poles (Ice)
    cloud_color: "#ffffff",             //Cloud Color
    cloud_opacity: 70,                  //Cloud Base Opacity
    atmosphere_color: "#4F7AAD",        //Atmosphere Color
    atmosphere_opacity: 40,             //Atmosphere Opacity/Density
    shading_level: 2,                   //Shading Level (Float 0-2, 2 = Maximum)
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
    pole_level: 0.50,                   //How big the Poles should be (Float 0-2, 2 = Full Coverage)
    craters: true,                      //Should Craters Spawn?
    clouds: true,                       //Should Clouds Spawn?
    atmosphere: true,                   //Should the Planet have an atmosphere
    poles: true,                        //Should the Planet have icy poles?
    hard_pole_lines: false              //Should the pole line be a hard or a soft cut?
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
let seed = "ASDFG";

let image = Planet.generatePlanet(size, planet_options, colors, seed, generator_options, cloud_generator);
```

## Sun
```js
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

let generator_options = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let size = 1000;
let seed = "ASDFG";

let image = Planet.generateStar(size, sun_options, sun_colors, seed, generator_options, blind_spots);
```

## Gas Giant
```js
let gasOptions = {
    giants_radius: 80,
    giants_atmosphere: 100,
    atmosphere: true,
    eyes: true
}

let gasColors = {
    base_color: "#edcab2",
    colors: [
        "#b4a79e",
        "#dcd0b8",
        "#d1a77f",
        "#e3dadf",
        "#ddb47e",
        "#b4a79e",
        "#de7650",
        "#d1a77f",
        "#e3dadf",
        "#ddb47e",
    ],
    atmosphere_color: "#edcab2",
    eye_color: "#d93a00",
    atmosphere_opacity: 70,
    shading_level: 2,
    add_detail: true,
}

let size = 200;
let seed = "ASDFG";

let image = Planet.generateGasGiant(size, gasOptions, gasColors, seed);
```

# Async
## ⚠ MAY BE UNSTABLE ⚠
Async is still in testing. You can use the async generation like
```javascript
let image = await asyncGeneratePlanet([...])
```
This works the same for GasGiants, Stars or normal Planets.

### Initial Testing seemed stable! ❤