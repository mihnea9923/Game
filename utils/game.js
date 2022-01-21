const colors = ['red', 'lime']
tc = 30;
pointX = pointY = 15
const pointScored = () => {
    pointX = Math.floor(Math.random() * tc);
    pointY = Math.floor(Math.random() * tc);
}

const getCoords = () => {
    return { x: pointX, y: pointY }
}

module.exports = {
    pointScored,
    getCoords
}