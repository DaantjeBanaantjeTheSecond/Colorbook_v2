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

    let keys = Object.keys(positions);
    let i = 0;
    let triangles = [];

    for (const key of keys) {
        if (i == 0) {
            triangles.push(new Triangle(positions[key].x, positions[key].y, positions[key].userColor, 0, 0, "0,0,0", width, 0, "0,0,0"));
            triangles.push(new Triangle(positions[key].x, positions[key].y, positions[key].userColor, width, 0, "0,0,0", width, height, "0,0,0"));
            triangles.push(new Triangle(positions[key].x, positions[key].y, positions[key].userColor, width, height, "0,0,0", 0, height, "0,0,0"));
            triangles.push(new Triangle(positions[key].x, positions[key].y, positions[key].userColor, 0, height, "0,0,0", 0, 0, "0,0,0"));
        } else {
            for (let j = triangles.length-1; j >= 0; j--) {
                let point = new Point(positions[key].x, positions[key].y, positions[key].userColor);
                if (pointInTriangle(point, triangles[j].p1, triangles[j].p2, triangles[j].p3)) {
                    triangles.push(new Triangle(point.x, point.y, point.c, triangles[j].p1.x, triangles[j].p1.y, triangles[j].p1.c, triangles[j].p2.x, triangles[j].p2.y, triangles[j].p2.c));
                    triangles.push(new Triangle(point.x, point.y, point.c, triangles[j].p2.x, triangles[j].p2.y, triangles[j].p2.c, triangles[j].p3.x, triangles[j].p3.y, triangles[j].p3.c));
                    triangles.push(new Triangle(point.x, point.y, point.c, triangles[j].p3.x, triangles[j].p3.y, triangles[j].p3.c, triangles[j].p1.x, triangles[j].p1.y, triangles[j].p1.c));
                    triangles.splice(j, 1);
                }
            }
        }
        i++;
    };

    for (let j = 0; j < triangles.length; j++) {
        triangles[j].display();
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

class Triangle {
    constructor(x1, y1, c1, x2, y2, c2, x3, y3, c3) {
        this.p1 = new Point(x1, y1, c1);
        this.p2 = new Point(x2, y2, c2);
        this.p3 = new Point(x3, y3, c3);
    }

    display() {
        strokeWeight(2);
        beginShape();
        this.c = this.p1.c.split(",");
        //stroke(this.c[0], this.c[1], this.c[2], 200);
        fill(this.c[0], this.c[1], this.c[2]);
        vertex(this.p1.x, this.p1.y);
        this.c = this.p2.c.split(",");
        //stroke(this.c[0], this.c[1], this.c[2], 200);
        fill(this.c[0], this.c[1], this.c[2]);
        vertex(this.p2.x, this.p2.y);
        this.c = this.p3.c.split(",");
        //stroke(this.c[0], this.c[1], this.c[2], 200);
        fill(this.c[0], this.c[1], this.c[2]);
        vertex(this.p3.x, this.p3.y);
        endShape(CLOSE);
        //triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
    }
}

class Point {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function pointInTriangle(p, p0, p1, p2)
{
    let s = p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y;
    let t = p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y;

    if ((s < 0) != (t < 0)) return false;

    let A = -p1.y * p2.x + p0.y * (p2.x - p1.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y;

    return A < 0 ? (s <= 0 && s + t >= A) : (s >= 0 && s + t <= A);
}