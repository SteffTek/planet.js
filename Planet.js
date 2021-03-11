const SimplexNoise  = require("simplex-noise");
const PerlinNoise = require('perlin-noise');
const PImage = require('pureimage');

/*
    RANDOM NOISE GENERATION
*/
function generatePerlinArray(width, height, options) {
    let perlinArray = [];
    let noise = PerlinNoise.generatePerlinNoise(width, height, options);
    for(let i = 0; i < height; i++) {
        let perlinRow = [];
        for(let i2 = 0; i2 < width; i2++) {
            perlinRow.push(noise[ ( i * width ) + i2])
        }
        perlinArray.push(perlinRow);
    }
    return perlinArray;
}

function generateSimplexArray(width, height, seed) {
    let x, y;
    let simplex = new SimplexNoise(seed);
    let simplexArray = [];
    for(y = 0; y < height; y++) {
        let simplexRow = [];
        for(x = 0; x < width; x++) {
            simplexRow.push(simplex.noise2D(x, y));
        }
        simplexArray.push(simplexRow);
    }
    return simplexArray;
}

/*
    COLOR FUNCTIONS
*/
function lightenColor(color, percent) {
    let num = parseInt(color.replace("#",""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = (num >> 8 & 0x00FF) + amt;
    let G = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

function percentToHex(percent) {
    if(percent < 0) {
        percent = 0;
    }
    if(percent > 100) {
        percent = 100;
    }
    percent /= 100;
    percent *= 255;
    percent = percent.toString(16);

    //ERROR CORRECTION
    percent = percent.split(".")[0];
    if(percent.length == 1) {
        percent = "0" + percent;
    }

    return percent;
}

// Version 4.0
function pSBC(p,c0,c1,l) {
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

/*
    PLANET UTILS
*/
function checkIfInRadius(x,y,centerX,centerY,radius) {
    let dist_points = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
    radius *= radius;
    if (dist_points < radius) {
        return true;
    }
    return false;
}

/*
    PLANET GENERATION
*/
function generatePlanet(imageSize, planetOptions, colors, hasClouds = false, hasAtmosphere = false, generatorOptions = null, cloudGeneratorOptions = null) {

    //GET VARS
    let width = imageSize, height = imageSize;
    let center = imageSize / 2;

    let radius = planetOptions.planet_radius;
    let atmosphere = planetOptions.atmosphere_radius;

    if(generatorOptions == null) {
        generatorOptions = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.5
        }
    }

    if(cloudGeneratorOptions == null) {
        cloudGeneratorOptions = {
            octaveCount: 6,
            amplitude: 8,
            persistence: 0.2
        }
    }

    let noise = generatePerlinArray(width, height, generatorOptions);

    let grass_noise = null;
    //GENERATE DETAILS IF ENABLED
    if(colors.add_detail) {
        grass_noise = generateSimplexArray(width, height, Math.random);
    }

    var image = PImage.make(width, height);
    var ctx = image.getContext('2d');

    //DRAW ATMOSPHERE FIRST
    if(hasAtmosphere && atmosphere > radius) {

        let steps = atmosphere - radius;
        let opacity = colors.atmosphere_opacity;

        for(let i = 0; i < steps; i++) {
            let atmosphere_circle = radius + i;
            let amp = ((steps-i)/steps)*100

            amp -= (100 - opacity);

            ctx.beginPath();
            ctx.arc(center,center,atmosphere_circle, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.atmosphere_color + percentToHex(amp);
            ctx.stroke();
        }
    }

    //DRAW PLANET SHAPE
    for(let i1 = 0; i1 < noise.length; i1++) {
        let row = noise[i1];

        for(let i2 = 0; i2 < row.length; i2++) {
            let value = row[i2];

            if(!checkIfInRadius(i2,i1,center,center,radius)) {
                continue;
            }

            let color = colors.land_color;
            let amp = 6;

            //MOUNTAIN LEVELS
            if(value >= planetOptions.mountain_level && value < planetOptions.mountain_top_level) {
                color = colors.mountain_color;
                amp = 3;
            }
            if(value >= planetOptions.mountain_top_level) {
                color = colors.mountain_top_color;
                amp = 6;
            }


            //GROUND AND SEE LEVEL
            if(value < planetOptions.beach_level && value > planetOptions.shore_level) {
                color = colors.beach_color;
                amp = 6;
            } else if(value <= planetOptions.shore_level && value > planetOptions.sea_level) {
                color = colors.shore_color;
                amp = 2;
            } else if(value <= planetOptions.sea_level) {
                color = colors.ocean_color;
                amp = 2;
            }

            //SHOULD ADD DETAILS
            if(colors.add_detail) {

                let detail_value = Number.parseFloat((value - 0.5).toFixed(2));
                color = pSBC(detail_value, color);
                color = lightenColor(color, grass_noise[i2][i1] * amp)
            }

            ctx.fillStyle = color;
            ctx.fillRect(i2,i1,1,1);
        }
    }

    //CLOUDS
    if(hasClouds) {
        let cloudNoise = generatePerlinArray(width, height, cloudGeneratorOptions);

        let cloud_radius = planetOptions.cloud_radius;
        let cloud_level = planetOptions.cloud_level;

        for(let i1 = 0; i1 < cloudNoise.length; i1++) {
            let row = cloudNoise[i1];

            for(let i2 = 0; i2 < row.length; i2++) {
                let value = row[i2];

                if(!checkIfInRadius(i2,i1,center,center,cloud_radius)) {
                    continue;
                }

                if(value < cloud_level) {
                    continue;
                }

                let color = colors.cloud_color;
                color = color + percentToHex(value * colors.cloud_opacity);

                ctx.fillStyle = color;
                ctx.fillRect(i2,i1,1,1);
            }
        }

    }

    return image;
}

module.exports = {
    generatePlanet: generatePlanet
}