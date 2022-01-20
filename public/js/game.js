var time = 60;
const player1 = {
    px: 4,
    py: 4,
    trail: [],
    tail: 5,
    xv: 0,
    yv: 0,
    color: 'blue'
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


    var id = setInterval(x => {


        socket.emit('updateCanvas', { player: player1, xv: xv1, yv: yv1 })
        // game(player2, xv1, yv1)

    }, 80);


}
socket.on("canvas", (data) => {
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    game(player1, xv1, yv1)
    game(data.player, data.xv, data.yv)
})

function game(player, xv, yv) {
    player.px += xv;
    player.py += yv;
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

    if (ax == player.px && ay == player.py) {
        player.tail++;
        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
}
function keyPush(evt) {
    if (evt.keyCode >= 37 && evt.keyCode <= 40)
        evt.preventDefault()
    switch (evt.keyCode) {
        case 37:
            xv1 = -1; yv1 = 0;
            break;
        case 38:
            xv1 = 0; yv1 = -1;
            break;
        case 39:
            xv1 = 1; yv1 = 0;
            break;
        case 40:
            xv1 = 0; yv1 = 1;
            break;
    }
}