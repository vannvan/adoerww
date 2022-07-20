let logUtils = function(content, color) {
    if (color !== undefined) {
        console.log(
            `${'\033'}[${bg[color.bg] || 40};${font[color.font] || 37}m ${content}`
        )
        console.log('\033[40;37m')
    } else {
        console.log(content)
    }
}



let colors = {
    font: {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        purple: 35,
        darkgreen: 36,
        white: 37
    },
    bg: {
        black: 40,
        red: 41,
        green: 42,
        yellow: 43,
        blue: 44,
        purple: 45,
        darkgreen: 46,
        white: 47
    }
}

font = colors.font
bg = colors.bg
module.exports = logUtils
