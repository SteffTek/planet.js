let sun_options = {
    star_radius: 80,
    radiation_radius: 100,
    radiation: true,
    blind_spot_level: 0.8
}

let sun_colors = {
    color: "#deab02",
    radiation_color: "#c98b2e",
    blind_spot_color: "#3b2600",
    radiation_opacity: 70,
    add_detail: true,
    blind_spots: true,
}

let blind_spots = {
    octaveCount: 6,
    amplitude: 1,
    persistence: 0.5
}

let generator_options = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let size = 200;

let image = Planet.generateStar(size, sun_options, sun_colors, generator_options, blind_spots);