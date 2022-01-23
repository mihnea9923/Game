function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
var point = {}
var time = 60;

var draw = true
const player1 = {
    px: 4,
    py: 4,
    trail: [],
    tail: 5,
    xv: 0,
    yv: 0,
    color: 'blue',
    id: generateUUID()
}
const player2 = {
    px: 1,
    py: 1,
    trail: [],
    tail: 5,
    xv: 0,
    yv: 0,
    color: 'lime'
}

px1 = py1 = 4;
px2 = 1, py2 = 4;
gs = 20;
tc = 30;
ax = ay = 15;
xv1 = yv1 = 0;
trail1 = [];
trail2 = []
tail1 = 5;
tail2 = 5;
window.onload = function () {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    socket.on('setColor', color => {
        player1.color = color
    })

    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    var id = setInterval(x => {
        // game(player1)
        socket.emit('updateCanvas', player1)
        // game(player2, xv1, yv1)

    }, 60);


}
socket.on("canvas", (data) => {
    if (draw) {
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
        game(player1)
        game(data)
    }
    draw = !draw;
})


socket.on('redPoint', (data) => {
    point = data

})



function game(player) {
    player.px += player.xv;
    player.py += player.yv;
    if (player.px < 0) {
        player.px = tc - 1;
    }
    if (player.px > tc - 1) {
        player.px = 0;
    }
    if (player.py < 0) {
        player.py = tc - 1;
    }
    if (player.py > tc - 1) {
        player.py = 0;
    }


    ctx.fillStyle = player.color;
    for (var i = 0; i < player.trail.length; i++) {
        ctx.fillRect(player.trail[i].x * gs, player.trail[i].y * gs, gs - 2, gs - 2);
        if (player.trail[i].x == player.px && player.trail[i].y == player.py) {
            player.tail = 5;
        }
    }
    player.trail.push({ x: player.px, y: player.py });
    while (player.trail.length > player.tail) {
        player.trail.shift();
    }
    if (point.x == player.px && point.y == player.py) {
        player.tail++;
        socket.emit('pointScored')
    }
    ctx.fillStyle = "red";
    ctx.fillRect(point.x * gs, point.y * gs, gs - 2, gs - 2);

}
function keyPush(evt) {
    if (evt.keyCode >= 37 && evt.keyCode <= 40)
        evt.preventDefault()
    switch (evt.keyCode) {
        case 37:
            player1.xv = -1; player1.yv = 0;
            break;
        case 38:
            player1.xv = 0; player1.yv = -1;
            break;
        case 39:
            player1.xv = 1; player1.yv = 0;
            break;
        case 40:
            player1.xv = 0; player1.yv = 1;
            break;
    }
}