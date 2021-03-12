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

let image = Planet.generateGasGiant(size, gasOptions, gasColors);