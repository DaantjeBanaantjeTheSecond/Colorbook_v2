let canvas;

let userColor = getCookie("userColor");

let positions = {};

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(1);
    smooth();
    noStroke();
}

function draw() {
    background(0);
    translate(-width/2, -height/2);
    let i = 0;
    let points = [];
    Object.keys(positions).forEach(function(key) {
        if (i < 2) {
            points.push(positions[key]);
            i ++;
        }
    });

    if (points.length == 2) {
        let x1 = min(points[0].x, points[1].x);
        let y1 = min(points[0].y, points[1].y);
        let x2 = max(points[0].x, points[1].x);
        let y2 = max(points[0].y, points[1].y);

        let c0 = points[0].userColor.split(",");
        let c1 = points[1].userColor.split(",");
        let mix = lerpColor(color(c0[0], c0[1], c0[2]), color(c1[0], c1[1], c1[2]), .5);
        
        beginShape();
        if (points[0].y < points[1].y) fill(c0[0], c0[1], c0[2]);
        else fill(c1[0], c1[1], c1[2]);
        vertex(x1, y1);
        
        fill(mix);
        vertex(x2, y1);
        
        if (points[0].y < points[1].y) fill(c1[0], c1[1], c1[2]);
        else fill(c0[0], c0[1], c0[2]);
        vertex(x2, y2);
        endShape();
        
        beginShape();
        if (points[0].y < points[1].y) fill(c1[0], c1[1], c1[2]);
        else fill(c0[0], c0[1], c0[2]);
        vertex(x2, y2);
        
        fill(mix);
        vertex(x1, y2);
        
        if (points[0].y < points[1].y) fill(c0[0], c0[1], c0[2]);
        else fill(c1[0], c1[1], c1[2]);
        vertex(x1, y1);
        endShape();
    }
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