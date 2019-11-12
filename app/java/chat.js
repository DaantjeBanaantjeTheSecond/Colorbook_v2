let canvas;

let userColor = getCookie("userColor");

let positions = {};

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();
    noStroke();
}

function draw() {
    background(0);
    
    blendMode(DIFFERENCE);
    
    Object.keys(positions).forEach(function(key) {
        let c = positions[key].userColor.split(',');
        fill(c[0], c[1], c[2]);
        circle(positions[key].x, positions[key].y, 600);
    });

    blendMode(BLEND);

}

document.addEventListener('mousemove', function(e) {
    socket.emit('mouse', {
        userColor: userColor,
        x: e.pageX,
        y: e.pageY
    });
});

socket.on('mousePositions', function(mousePositions) {
    Object.keys(mousePositions).forEach(function(key) {
        if (positions[key] != undefined) {
            // user exists
            positions[key].x = mousePositions[key].x;
            positions[key].y = mousePositions[key].y;
        } else {
            // user does not exist
            let mousePos = {
                userColor: mousePositions[key].userColor,
                x: mousePositions[key].x,
                y: mousePositions[key].y
            }
            
            positions[key] = mousePos;
        }
    });

    Object.keys(positions).forEach(function(key) {
        if (mousePositions[key] === undefined) {
            delete positions[key];
        }
    });
});

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}