let generator_options = {
    octaveCount: 9,
    amplitude: 5,
    persistence: 0.5
}

let sun_options = {
    star_radius: 80,
    radiation_radius: 100,
    radiation: true,
    blind_spot_level: 0
}

let sun_colors = {
    color: "#51bdb7",
    radiation_color: "#158c86",
    blind_spot_color: "#3b2600",
    radiation_opacity: 70,
    add_detail: true,
    blind_spots: false,
}

let size = 200;

let image = Planet.generateStar(size, sun_options, sun_colors, generator_options);