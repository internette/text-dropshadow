(function () {
    var dummy = document.createElement("div");
    document.head.appendChild(dummy);
    var _ = self.DropShadow = function (opts) {
        var me = this;
        // _.all.push(this);

        opts = opts || {};
        this.angle = opts.angle;
        this.length = opts.length;
        this.stops = opts.stops;

    }
    _.prototype = {
        toString: function () {
            return this.dropShadow;
        },
        get endPoint() {
            var result = {};

            result.x = Math.round(Math.cos(parseInt(this.angle) * Math.PI / 180) * parseInt(this.length) + 0);
            result.y = Math.round(Math.sin(parseInt(this.angle) * Math.PI / 180) * parseInt(this.length) + 0);

            return result;
        },
        get slope() {
            if (this.endPoint.x == 0) {
                return null;
            }
            return (this.endPoint.x) / (this.endPoint.y);
        },
        get points() {
            var coordinates = [];
            for (var x = 0; x < this.endPoint.x; x += 0.3) {
                var y = this.slope * x;
                coordinates.push({ x: x, y: y });
            }
            return coordinates;
        },
        get dropShadow() {
            var dropshadow = '';
            for (var i = 0; i < this.points.length; i++) {
                var curr_point = this.points[i];
                dropshadow += curr_point.x + 'px ' + curr_point.y + 'px 0 ' + this.interpolatedColors[i];
                dropshadow += i === (this.points.length - 1) ? '' : ', '
            }
            return dropshadow;
        },
        get formattedColors() {
            var colors = [];
            for (var i = 0; i < this.stops.length; i++) {
                var color_arr = this.stops[i].trim().match(/ /gi) ? this.stops[i].trim().split(' ') : this.stops[i];
                var color = typeof color_arr === 'object' ? color_arr[0] : color_arr;
                var color_position_base = typeof color_arr !== 'object' ? 100 / (this.stops.length - 1) : null;
                var color_position = '';
                if (color_position_base) {
                    if (i === 0) {
                        color_position = '0%';
                    } else if (i === (this.stops.lengths - 1)) {
                        color_position = '100%';
                    } else {
                        color_position = (color_position_base * i) + '%';
                    }
                }
                var position = typeof color_arr === 'object' ? color_arr[1] : color_position;
                var color_obj = {
                    color: color.trim(),
                    position: position
                }
                colors.push(color_obj)
            }
            return colors;
        },
        get formattedColorsWithSteps() {
            var colors = this.formattedColors;
            for (var i = 0; i < colors.length; i++) {
                if (i === 0) {
                    // This checks if the current value and next value are the same,
                    // To know if the first value is in relation to the next value
                    if (parseInt(colors[i].position) !== 0) {
                        // We add this first list to get the steps
                        // between 0 and the first starting point
                        colors[i].steps = ((parseInt(colors[i + 1].position) - parseInt(colors[i].position)) * parseInt(this.points.length)) / 100
                        colors[i].steps += (parseInt(colors[i].position) * parseInt(this.points.length)) / 100
                    } else {
                        colors[i].steps = ((parseInt(colors[i + 1].position) - parseInt(colors[i].position)) * parseInt(this.points.length)) / 100
                    }
                } else if (i === colors.length - 1) {
                    // we subtract from 100 because we want the steps in relation 
                    // to the percentage of the color
                    colors[i].steps = ((100 - parseInt(colors[i].position)) * parseInt(this.points.length)) / 100
                } else {
                    colors[i].steps = ((parseInt(colors[i + 1].position) - parseInt(colors[i].position)) * parseInt(this.points.length)) / 100
                }
            }
            return colors;
        },
        get interpolatedColors() {
            var colors_array = [];
            for (var i = 0; i < this.formattedColorsWithSteps.length; i++) {
                var current_color = this.formattedColorsWithSteps[i];
                var next_color = this.formattedColorsWithSteps[i + 1];
                var current_stepper = current_color.steps;
                for (var j = 0; j < current_stepper; j++) {
                    var curr_step = j / current_stepper;
                    if (i < (this.formattedColorsWithSteps.length - 1)) {
                        if (current_color.color === 'transparent') {
                            var color = next_color.color.match(/#/gi) ? next_color.color : this.convertColorToHex(next_color.color);
                            colors_array.push('rgba(' + this.getRGBfromHEX(color).r + ', ' + this.getRGBfromHEX(color).g + ', ' + this.getRGBfromHEX(color).b + ', ' + curr_step + ')');
                        } else if (next_color.color === 'transparent') {
                            var color = current_color.color.match(/#/gi) ? current_color.color : this.convertColorToHex(current_color.color);
                            colors_array.push('rgba(' + this.getRGBfromHEX(color).r + ', ' + this.getRGBfromHEX(color).g + ', ' + this.getRGBfromHEX(color).b + ', ' + (1 - curr_step) + ')');
                        } else if (current_color.position === next_color.position) {
                            var converted_current_color = current_color.color.match(/#/gi) ? current_color.color : this.convertColorToHex(current_color.color);
                            colors_array.push(converted_current_color);
                        } else {
                            var converted_current_color = current_color.color.match(/#/gi) ? current_color.color : this.convertColorToHex(current_color.color);
                            var converted_next_color = next_color.color.match(/#/gi) ? next_color.color : this.convertColorToHex(next_color.color);
                            var color = this.interpolateColor(converted_current_color, converted_next_color, curr_step);
                            colors_array.push(color);
                        }
                    } else {
                        if (current_color.color === 'transparent') {
                            var color = next_color.color.match(/#/gi) ? next_color.color : this.convertColorToHex(next_color.color);
                            colors_array.push('rgba(' + this.getRGBfromHEX(color).r + ', ' + this.getRGBfromHEX(color).g + ', ' + this.getRGBfromHEX(color).b + ', ' + (1 - curr_step) + ')');
                        } else {
                            var converted_current_color = current_color.color.match(/#/gi) ? current_color.color : this.convertColorToHex(current_color.color);
                            colors_array.push(converted_current_color);
                        }
                    }
                }
            }
            return colors_array;
        },
        interpolateColor: function (a, b, amount) {

            var ah = parseInt(a.replace(/#/g, ''), 16),
                ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
                bh = parseInt(b.replace(/#/g, ''), 16),
                br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
                rr = ar + amount * (br - ar),
                rg = ag + amount * (bg - ag),
                rb = ab + amount * (bb - ab);

            return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
        },
        convertColorToHex: function (color) {
            var colors = {
                "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
                "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
                "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
                "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
                "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
                "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
                "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
                "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
                "honeydew": "#f0fff0", "hotpink": "#ff69b4",
                "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
                "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
                "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
                "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
                "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
                "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
                "navajowhite": "#ffdead", "navy": "#000080",
                "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
                "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
                "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
                "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
                "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
                "violet": "#ee82ee",
                "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
                "yellow": "#ffff00", "yellowgreen": "#9acd32"
            };

            if (typeof colors[color.toLowerCase()] != 'undefined')
                return colors[color.toLowerCase()];

            return false;
        },
        getRGBfromHEX: function (value) {
            var color_val = value;
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            color_val = !color_val.match(/#/gi) ? this.convertColorToHex(color_val) : color_val;
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            color_val = color_val.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_val);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }
})();
if (self.StyleFix) {
    (function () {
        var dummy = document.createElement("p");
        dummy.style.textShadow = "dropshadow(white, black)";
        dummy.style.textShadow = PrefixFree.prefix + "dropshadow(white, black)";

        if (!dummy.style.textShadow) {
            StyleFix.register(function (css, raw) {
                if (css.indexOf("dropshadow") > -1) {
                    css = css.replace(/dropshadow\(\s*((?:\([^()]+\)|[^;()}])+?)\)/g, function (full_selector, values) {
                        function matchDeg(should_match = true) {
                            var val_arr = values.split(',');
                            val_arr = should_match ? val_arr : val_arr.filter(function (val) { return val ? !val.match(/deg/gi) : null });
                            return val_arr.find(function (input) {
                                var regexMatch = new RegExp(/\D/, 'gi');
                                return input.match(regexMatch);
                            });
                        }
                        var angle = matchDeg() && !isNaN(parseInt(matchDeg())) ? parseInt(matchDeg()) + 'deg' : '45deg';
                        var length = matchDeg(false) && !isNaN(parseInt(matchDeg(false))) ? matchDeg(false) : '20px';
                        var stops = values.replace(angle, '').replace(length, '').split(',').filter(function (n) { return n.trim().length > 0 })
                        return new DropShadow({
                            angle: angle,
                            length: length,
                            stops: stops
                        });
                    });
                }

                return css;
            });
        }
    })();
}