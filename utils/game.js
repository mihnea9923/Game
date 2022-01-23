const { getUsersLength } = require('./users')

const colors = ['orange', 'lime']
tc = 30;
pointX = pointY = 15
const pointScored = () => {
    pointX = Math.floor(Math.random() * tc);
    pointY = Math.floor(Math.random() * tc);
}

const getCoords = () => {
    return { x: pointX, y: pointY }
}

const getColor = () => {
    return colors[getUsersLength()]
}
module.exports = {
    pointScored,
    getCoords,
    getColor
}