const SimplexNoise = require("simplex-noise");
const PerlinNoise = require('seeded-perlin-noise');
const PImage = require('pureimage');
const fs = require('fs');

/*
    RANDOM NOISE GENERATION
*/
function generatePerlinArray(width, height, options, seed = null) {
    let perlinArray = [];

    //SET SEED IF SET
    PerlinNoise.setSeed(seed);

    let noise = PerlinNoise.generatePerlinNoise(width, height, options);
    for (let i = 0; i < height; i++) {
        let perlinRow = [];
        for (let i2 = 0; i2 < width; i2++) {
            perlinRow.push(noise[(i * width) + i2])
        }
        perlinArray.push(perlinRow);
    }
    return perlinArray;
}

function generateSimplexArray(width, height, seed) {
    let x, y;
    let simplex = new SimplexNoise(seed);
    let simplexArray = [];
    for (y = 0; y < height; y++) {
        let simplexRow = [];
        for (x = 0; x < width; x++) {
            simplexRow.push(simplex.noise2D(x, y));
        }
        simplexArray.push(simplexRow);
    }
    return simplexArray;
}

function craterMap(width, height, generator_options, seed) {
    let perlinNoise = generatePerlinArray(width, height, generator_options, seed);
    let craters = []; //[[x,y],[x,y]]

    for (let x = 0; x < perlinNoise.length; x++) {
        let row = perlinNoise[x];

        let y = indexOfMax(row);
        craters.push([x, y]);

        x += Math.round(width / 10);
    }

    return craters;
}

/*
    UTILS
*/
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function getRndBias(min, max, bias, influence) {
    var rnd = Math.random() * (max - min) + min,   // random in range
        mix = Math.random() * influence;           // random mixer
    return rnd * (1 - mix) + bias * mix;           // mix full range and bias
}

/*
    COLOR FUNCTIONS
*/
function lightenColor(color, percent) {
    let num = parseInt(color.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = (num >> 8 & 0x00FF) + amt;
    let G = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

function percentToHex(percent) {
    if (percent < 0) {
        percent = 0;
    }
    if (percent > 100) {
        percent = 100;
    }
    percent /= 100;
    percent *= 255;
    percent = percent.toString(16);

    //ERROR CORRECTION
    percent = percent.split(".")[0];
    if (percent.length == 1) {
        percent = "0" + percent;
    }

    return percent;
}

function getRGB(color) {
    let num = parseInt(color.replace("#", ""), 16);
    let R = (num >> 16);
    let B = (num >> 8 & 0x00FF);
    let G = (num & 0x0000FF);

    return [R, G, B];
}

function getHex(R, G, B) {
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}

function blendColors(color1, color2, blend) {

    let rgb1 = getRGB(color1);
    let rgb2 = getRGB(color2);

    let arr = [
        Number.parseInt(rgb1[0] * (1 - blend) + rgb2[0] * blend),
        Number.parseInt(rgb1[1] * (1 - blend) + rgb2[1] * blend),
        Number.parseInt(rgb1[2] * (1 - blend) + rgb2[2] * blend),
    ];

    return getHex(arr[0], arr[1], arr[2]);
}

function pSBC(p, c0, c1, l) {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

/*
    PLANET UTILS
*/
function checkIfInRadius(x, y, centerX, centerY, radius) {
    let dist_points = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
    radius *= radius;
    if (dist_points < radius) {
        return true;
    }
    return false;
}

function checkIfInEllipse(x, y, centerX, centerY, width, height) {
    width *= width;
    height *= height;

    let meff = (Math.pow((x - centerX),2) / width) + (Math.pow((y - centerY), 2) / height);

    if(meff <= 1) {
        return true;
    }

    return false;
}

function calcShading(input, center, progression, shading_level) {
    let shading_begin = center * shading_level;
    if (progression > shading_begin) {
        input += (shading_begin - progression);
    }
    if (input < -90) {
        input = -90
    }
    return input;
}

function distance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}

function distanceInCircle(centerX, centerY, x, y, radius) {
    return Math.abs(distance(centerX, centerY, x, y)) / radius;
}

function distanceInEllipse(centerX, centerY, x, y, width, height) {
    width *= width;
    height *= height;
    let meff = (Math.pow((x - centerX),2) / width) + (Math.pow((y - centerY), 2) / height);
    return meff;
}

/*
    PLANET GENERATION
*/
function generatePlanet(imageSize, planetOptions, colors, seed = null, generatorOptions = null, cloudGeneratorOptions = null) {

    //GET VARS
    let width = imageSize, height = imageSize;
    let center = imageSize / 2;

    let radius = planetOptions.planet_radius;
    let atmosphere = planetOptions.atmosphere_radius;

    let hasClouds = planetOptions.clouds;
    let hasAtmosphere = planetOptions.atmosphere;
    let hasCraters = planetOptions.craters;

    if (generatorOptions == null) {
        generatorOptions = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.5
        }
    }

    if (cloudGeneratorOptions == null) {
        cloudGeneratorOptions = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.2
        }
    }

    let noise = generatePerlinArray(width, height, generatorOptions, seed);

    let grass_noise = null;
    //GENERATE DETAILS IF ENABLED
    if (colors.add_detail) {
        grass_noise = generateSimplexArray(width, height, seed);
    }

    var image = PImage.make(width, height);
    var ctx = image.getContext('2d');

    //DRAW ATMOSPHERE FIRST
    if (hasAtmosphere && atmosphere > radius) {

        let steps = atmosphere - radius;
        let opacity = colors.atmosphere_opacity;

        for (let i = 0; i < steps; i++) {
            let atmosphere_circle = radius + i;
            let amp = ((steps - i) / steps) * 100

            amp -= (100 - opacity);

            ctx.beginPath();
            ctx.arc(center, center, atmosphere_circle, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.atmosphere_color + percentToHex(amp);
            ctx.stroke();
        }
    }

    //DRAW PLANET SHAPE
    for (let i1 = 0; i1 < noise.length; i1++) {
        let row = noise[i1];

        for (let i2 = 0; i2 < row.length; i2++) {
            let value = row[i2];

            if (!checkIfInRadius(i2, i1, center, center, radius)) {
                continue;
            }

            let color = colors.land_color;
            let amp = 6;

            //MOUNTAIN LEVELS
            if (value >= planetOptions.mountain_level && value < planetOptions.mountain_top_level) {
                color = colors.mountain_color;
                amp = 3;
            }
            if (value >= planetOptions.mountain_top_level) {
                color = colors.mountain_top_color;
                amp = 6;
            }


            //GROUND AND SEE LEVEL
            if (value < planetOptions.beach_level && value > planetOptions.shore_level) {
                color = colors.beach_color;
                amp = 6;
            } else if (value <= planetOptions.shore_level && value > planetOptions.sea_level) {
                color = colors.shore_color;
                amp = 2;
            } else if (value <= planetOptions.sea_level) {
                color = colors.ocean_color;
                amp = 2;
            }

            //SHOULD ADD DETAILS
            if (colors.add_detail) {

                let detail_value = Number.parseFloat(((value * 0.25) - 0.5).toFixed(2));
                color = pSBC(detail_value, color);

                let lightenAmount = grass_noise[i2][i1] * amp
                lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                color = lightenColor(color, lightenAmount)
            }

            ctx.fillStyle = color;
            ctx.fillRect(i2, i1, 1, 1);
        }
    }

    //POLES
    if(planetOptions.poles) {
        let pole_level = planetOptions.pole_level;
        let pole_size = (radius * pole_level);
        let inner_pole = (radius * pole_level) * 0.9;

        let north_pole = [width / 2, imageSize / 2 - radius], south_pole = [width / 2,imageSize / 2 + radius]

        //DRAW POLES
        for (let i1 = 0; i1 < noise.length; i1++) {
            let row = noise[i1];

            for (let i2 = 0; i2 < row.length; i2++) {
                let value = noise[i1][i2];

                //CHECK IF IN PLANET RADIUS
                if (!checkIfInRadius(i2, i1, center, center, radius)) {
                    continue;
                }

                //CHECK IF IN POLE RADIUS
                if(!checkIfInEllipse(i2,i1,north_pole[0],north_pole[1],radius * 2,pole_size) && !checkIfInEllipse(i2,i1,south_pole[0],south_pole[1],radius * 2,pole_size)) {
                    continue;
                }

                //OUTER ELLIPSE

                color = colors.pole_color;

                let lighter = distanceInEllipse(north_pole[0], north_pole[1], north_pole[0], i1, radius * 2,pole_size);
                if(i1 > imageSize / 2) {
                    lighter = distanceInEllipse(south_pole[0], south_pole[1], south_pole[0], i1, radius * 2,pole_size);
                }

                let lighter2 = distanceInEllipse(north_pole[0], north_pole[1], north_pole[0], i1, radius * 2,inner_pole);
                if(i1 > imageSize / 2) {
                    lighter2 = distanceInEllipse(south_pole[0], south_pole[1], south_pole[0], i1, radius * 2,inner_pole);
                }

                lighter *= lighter2;
                if(lighter > 1) {
                    lighter = 1;
                }

                let p = ctx.getImageData(i2, i1, 1, 1).data;
                let hex = getHex(p[0], p[2], p[1]);

                if(!planetOptions.hard_pole_lines) {
                    color = blendColors(color, hex, lighter);
                }


                if (colors.add_detail) {
                    let lightenAmount = grass_noise[i2][i1] * 5
                    lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                    color = lightenColor(color, lightenAmount)
                }

                //GROUND AND SEE LEVEL
                if (value < planetOptions.beach_level) {
                    color = blendColors("#BDDEEC", hex, lighter + 0.01);
                }

                ctx.fillStyle = color;
                ctx.fillRect(i2, i1, 1, 1);
            }
        }
    }

    //CRATERS
    if (hasCraters) {
        let craters = craterMap(width, height, generatorOptions, seed);

        for (let i = 0; i < craters.length; i++) {
            let crater = craters[i];
            let x = crater[0];
            let y = crater[1];

            let crater_radius = Math.round(Math.random() * (width / 15));
            let crater_ring = Math.round(crater_radius * 0.1);
            let inner_crater = Math.round(crater_radius * 0.2);
            crater_radius = crater_radius + crater_ring;

            let blending = generatePerlinArray(width, width, cloudGeneratorOptions, seed);

            let x1 = 0;
            let y1 = 0;

            for (let i1 = (x - crater_radius); i1 < (x + crater_radius); i1++) {
                for (let i2 = (y - crater_radius); i2 < (y + crater_radius); i2++) {

                    //WORLD RADIUS
                    if (!checkIfInRadius(i1, i2, center, center, radius)) {
                        continue;
                    }

                    if (!checkIfInRadius(i1, i2, x, y, crater_radius)) {
                        continue;
                    }

                    color = colors.crater_color;
                    if (checkIfInRadius(i1, i2, x, y, crater_radius - crater_ring)) {
                        color = pSBC(0.2, color);
                    }

                    if (checkIfInRadius(i1, i2, x, y, inner_crater)) {
                        color = pSBC(-0.3, color);
                    }

                    let lighter = distanceInCircle(x, y, i1, i2, crater_radius);

                    if (lighter > 0.5) {
                        let p = ctx.getImageData(i1, i2, 1, 1).data;
                        var hex = getHex(p[0], p[2], p[1]);
                        color = blendColors(color, hex, lighter);
                    } else {
                        color = pSBC(lighter, color);
                    }

                    value = noise[i1][i2]
                    if (value <= planetOptions.shore_level && value > planetOptions.sea_level) {
                        color = colors.shore_color;
                    } else if (value <= planetOptions.sea_level) {
                        color = colors.ocean_color;
                    }

                    if (colors.add_detail) {
                        let detail_value = Number.parseFloat((blending[i2][i1] - 1).toFixed(2));
                        color = pSBC(detail_value, color);

                        let lightenAmount = grass_noise[i2][i1] * 5
                        lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                        color = lightenColor(color, lightenAmount)
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(i2, i1, 1, 1);

                    //INCREASE COORDINATE
                    y1++;
                }
                //INCREASE COORDINATE
                x1++;
            }
        }
    }

    //CLOUDS
    if (hasClouds) {
        let cloudNoise = generatePerlinArray(width, height, cloudGeneratorOptions, seed);

        let cloud_radius = planetOptions.cloud_radius;
        let cloud_level = planetOptions.cloud_level;

        for (let i1 = 0; i1 < cloudNoise.length; i1++) {
            let row = cloudNoise[i1];

            for (let i2 = 0; i2 < row.length; i2++) {
                let value = row[i2];

                if (!checkIfInRadius(i2, i1, center, center, cloud_radius)) {
                    continue;
                }

                if (value < cloud_level) {
                    continue;
                }

                let color = colors.cloud_color;
                let lightenAmount = calcShading(0, center, i1, colors.shading_level);
                color = lightenColor(color, lightenAmount)

                color = color + percentToHex(value * colors.cloud_opacity);
                ctx.fillStyle = color;
                ctx.fillRect(i2, i1, 1, 1);
            }
        }

    }

    return image;
}

function generateStar(imageSize, starOptions, colors, seed = null, generatorOptions = null, blindSpotsGenerator = null) {
    //GET VARS
    let width = imageSize, height = imageSize;
    let center = imageSize / 2;

    let radius = starOptions.star_radius;
    let radiation = starOptions.radiation_radius;

    let color_radiation = colors.radiation_color;
    let opacity_radiation = colors.radiation_opacity;

    let hasRadiation = starOptions.radiation;

    if (generatorOptions == null) {
        generatorOptions = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.5
        }
    }

    if (blindSpotsGenerator == null) {
        blindSpotsGenerator = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.2
        }
    }

    let noise = generatePerlinArray(width, height, generatorOptions, seed);
    let grass_noise = null;
    //GENERATE DETAILS IF ENABLED
    if (colors.add_detail) {
        grass_noise = generateSimplexArray(width, height, seed);
    }

    var image = PImage.make(width, height);
    var ctx = image.getContext('2d');

    //DRAW ATMOSPHERE FIRST
    if (hasRadiation && radiation > radius) {

        let steps = radiation - radius;

        for (let i = 0; i < steps; i++) {
            let radiation_circle = radius + i;
            let amp = ((steps - i) / steps) * 100

            amp -= (100 - opacity_radiation);

            ctx.beginPath();
            ctx.arc(center, center, radiation_circle, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = color_radiation + percentToHex(amp);
            ctx.stroke();
        }
    }

    //DRAW STAR SHAPE
    for (let i1 = 0; i1 < noise.length; i1++) {
        let row = noise[i1];

        for (let i2 = 0; i2 < row.length; i2++) {
            let value = row[i2];

            if (!checkIfInRadius(i2, i1, center, center, radius)) {
                continue;
            }

            let color = colors.color;

            if (colors.add_detail) {
                let detail_value = Number.parseFloat((value - 0.5).toFixed(2));
                color = pSBC(detail_value, color);

                let lightenAmount = grass_noise[i2][i1] * 20
                color = lightenColor(color, lightenAmount)
            }

            ctx.fillStyle = color;
            ctx.fillRect(i2, i1, 1, 1);
        }
    }

    //BlindSpots
    if (colors.blind_spots) {
        let blindSpotNoise = generatePerlinArray(width, height, blindSpotsGenerator, seed);

        for (let i1 = 0; i1 < blindSpotNoise.length; i1++) {
            let row = blindSpotNoise[i1];

            for (let i2 = 0; i2 < row.length; i2++) {
                let value = row[i2];

                if (!checkIfInRadius(i2, i1, center, center, radius)) {
                    continue;
                }

                if (value < starOptions.blind_spot_level) {
                    continue;
                }

                let color = colors.blind_spot_color;

                let detail_value = Number.parseFloat((value - 0.5).toFixed(2));
                color = pSBC(-detail_value, color);

                let lightenAmount = grass_noise[i2][i1] * 10
                color = lightenColor(color, lightenAmount)

                ctx.fillStyle = color;
                ctx.fillRect(i2, i1, 1, 1);
            }
        }

    }

    return image;
}

function generateGasGiant(imageSize, options, colors, seed = null) {

    //GET VARS
    let width = imageSize, height = imageSize;
    let center = imageSize / 2;

    let radius = options.giants_radius;
    let atmosphere = options.giants_atmosphere;

    let hasEyes = options.eyes;
    let hasAtmosphere = options.atmosphere;

    let grass_noise = null;
    //GENERATE DETAILS IF ENABLED
    if (colors.add_detail) {
        grass_noise = generateSimplexArray(width, height, seed);
    }

    var image = PImage.make(width, height);
    var ctx = image.getContext('2d');

    //DRAW ATMOSPHERE FIRST
    if (hasAtmosphere && atmosphere > radius) {

        let steps = atmosphere - radius;
        let opacity = colors.atmosphere_opacity;

        for (let i = 0; i < steps; i++) {
            let atmosphere_circle = radius + i;
            let amp = ((steps - i) / steps) * 100

            amp -= (100 - opacity);

            ctx.beginPath();
            ctx.arc(center, center, atmosphere_circle, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.atmosphere_color + percentToHex(amp);
            ctx.stroke();
        }
    }

    //DRAW PLANET SHAPE
    for (let i1 = 0; i1 < height; i1++) {
        for (let i2 = 0; i2 < width; i2++) {

            if (!checkIfInRadius(i2, i1, center, center, radius)) {
                continue;
            }
            let color = colors.base_color;

            //SHOULD ADD DETAILS
            if (colors.add_detail) {
                let lightenAmount = grass_noise[i2][i1] * 6
                lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                color = lightenColor(color, lightenAmount)
            }

            ctx.fillStyle = color;
            ctx.fillRect(i2, i1, 1, 1);
        }
    }

    //DRAW PLANET RINGS
    let noise_steps = (radius * 2.5) / colors.colors.length;
    for (let i = 0; i < colors.colors.length; i++) {
        for (let i1 = 0; i1 < height; i1++) {

            //Get Blend Value
            let blend_value = ((noise_steps * i + i1) % noise_steps) / noise_steps;

            for (let i2 = 0; i2 < width; i2++) {

                if (!checkIfInRadius(i2, i1, center, center, radius)) {
                    continue;
                }

                if (noise_steps * i > i1) {
                    break;
                }

                let color = colors.colors[i];
                let next_color = colors.colors[i + 1];
                if (next_color == null) {
                    next_color = color;
                }
                color = blendColors(color, next_color, blend_value);

                //SHOULD ADD DETAILS
                if (colors.add_detail) {
                    let lightenAmount = grass_noise[i2][i1] * 6
                    lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                    color = lightenColor(color, lightenAmount)
                }

                ctx.fillStyle = color;
                ctx.fillRect(i2, i1, 1, 1);
            }
        }
    }

    //DRAW EYES
    if (hasEyes) {
        let eyes = craterMap(width, height, cloudGeneratorOptions = { octaveCount: 4, amplitude: 1, persistence: 0.2 }, seed)

        for (let i = 0; i < eyes.length; i++) {
            let eye = eyes[i];
            let x = eye[0];
            let y = eye[1];

            let eye_radius = Math.round(Math.random() * (width / 15));
            let inner_crater = Math.round(eye_radius * 0.2);

            let x1 = 0;
            let y1 = 0;

            for (let i1 = (x - eye_radius); i1 < (x + eye_radius); i1++) {
                for (let i2 = (y - eye_radius); i2 < (y + eye_radius); i2++) {

                    //WORLD RADIUS
                    if (!checkIfInRadius(i1, i2, center, center, radius)) {
                        continue;
                    }

                    //EYE RADIUS
                    if (!checkIfInRadius(i1, i2, x, y, eye_radius)) {
                        continue;
                    }

                    color = colors.eye_color;

                    if (checkIfInRadius(i1, i2, x, y, inner_crater)) {
                        color = pSBC(-0.3, color);
                    }

                    let lighter = Math.abs(distance(x, y, i1, i2) / eye_radius);

                    if (lighter > 0.3) {
                        let p = ctx.getImageData(i1, i2, 1, 1).data;
                        var hex = getHex(p[0], p[2], p[1]);
                        color = blendColors(color, hex, lighter);
                    } else {
                        color = pSBC(lighter, color);
                    }

                    if (colors.add_detail) {
                        let lightenAmount = grass_noise[i1][i2] * 5
                        lightenAmount = calcShading(lightenAmount, center, i1, colors.shading_level);
                        color = lightenColor(color, lightenAmount)
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(i2, i1, 1, 1);

                    //INCREASE COORDINATE
                    y1++;
                }
                //INCREASE COORDINATE
                x1++;
            }
        }
    }

    return image;
}

/*
    ASYNC FUNCTIONS
*/
const asyncGeneratePlanet = (imageSize, planetOptions, colors, seed = null, generatorOptions = null, cloudGeneratorOptions = null) => {
    return new Promise((resolve) => {
        let image = generatePlanet(imageSize, planetOptions, colors, seed, generatorOptions, cloudGeneratorOptions);
        resolve(image);
    })
}

const asyncGenerateGasGiant = (imageSize, options, colors, seed) => {
    return new Promise((resolve) => {
        let image = generateGasGiant(imageSize, options, colors, seed);
        resolve(image);
    })
}

const asyncGenerateStar = (imageSize, starOptions, colors, seed = null, generatorOptions = null, blindSpotsGenerator = null) => {
    return new Promise((resolve) => {
        let image = generateStar(imageSize, starOptions, colors, seed, generatorOptions, blindSpotsGenerator);
        resolve(image);
    })
}

/*
    DATA FUNCTIONS
*/
async function save(object, path) {
    await PImage.encodePNGToStream(object, fs.createWriteStream(path));
}

async function getBuffer(object) {
    return await object.data;
}

/*
    OTHER PUBLIC
*/
function rotate(original, degrees) {

    let width = original.width;
    let height = original.height;

    var newImage = PImage.make(width, height);
    var context = newImage.getContext('2d');

    var angle = degrees * Math.PI / 180;

    context.clearRect(0,0,width,height);
    context.translate(width / 2, height / 2);
    context.rotate(angle);
    context.drawImage(original, -width / 2, -height / 2, width, height);
    context.rotate(-angle);
    context.translate(-width, -height);

    return newImage;
}

/*
    EXPORTS
*/
module.exports = {
    asyncGenerateGasGiant: asyncGenerateGasGiant,
    asyncGeneratePlanet: asyncGeneratePlanet,
    asyncGenerateStar: asyncGenerateStar,
    generateGasGiant: generateGasGiant,
    generatePlanet: generatePlanet,
    generateStar: generateStar,
    getBuffer: getBuffer,
    rotate: rotate,
    save: save,
}
