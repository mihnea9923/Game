
var point = {}
var time = 60;
var canPlay = false
var draw = true
var gameFinishedText = ''
const player1 = {
    px: 4,
    py: 4,
    trail: [],
    tail: 5,
    xv: 0,
    yv: 0,
    color: 'blue',
    id: Math.random()
}
gs = 20;
tc = 30;
window.onload = function () {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    socket.on('setColor', color => {
        player1.color = color
    })
    //start game counter
    socket.on('startGame', () => {
        time = 60;
        resetPlayer()
        var timeInterval = setInterval(() => {
            if (time > 0 && canPlay) {
                time--
                document.getElementById('time').innerHTML = "Time left: " + time + " s"
            }
            else {
                document.getElementById('button').style.display = 'inline-block'
                document.getElementById('time').innerHTML = gameFinishedText
                canPlay = false
                clearCanvas()
                clearInterval(timeInterval)
            }
        }, 1000)
    })

    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    var id = setInterval(x => {
        if (canPlay) {
            socket.emit('updateCanvas', player1)
        }

    }, 60);


}
socket.on("canvas", (data) => {
    if (draw && canPlay) {
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
        game(player1)
        game(data)
        if (player1.id != data.id) {
            console.log(player1.id, data.id);
            if (player1.trail.length > data.trail.length) {
                gameFinishedText = "You won"
            }
            else if (player1.trail.length < data.trail.length) {
                gameFinishedText = "You lost"
            }
            else {
                gameFinishedText = "Draw round"
            }
        }
    }
    draw = !draw;
})

socket.on('setCanPlay', () => canPlay = true)

socket.on('redPoint', (data) => {
    point = data

})

function play() {
    socket.emit('readyToPlay')
    document.getElementById('button').style.display = 'none'
}

function clearCanvas() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

}

function resetPlayer() {
    player1.px = 4
    player1.py = 4
    player1.trail = []
    player1.tail = 5
    player1.xv = 0
    player1.yv = 0
}

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