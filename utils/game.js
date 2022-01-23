const { getUsersLength } = require('./users')

const colors = ['orange', 'lime']
tc = 30;
pointX = pointY = 15
playersReady = 0
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

const playerReady = () => playersReady++

const canPlay = () => playersReady >= 2

const playerOut = () => {
    if (playersReady > -1) {
        playersReady--
    }
}

const resetGame = () => playersReady = 0
module.exports = {
    pointScored,
    getCoords,
    getColor,
    playerReady,
    canPlay,
    playerOut,
    resetGame
}