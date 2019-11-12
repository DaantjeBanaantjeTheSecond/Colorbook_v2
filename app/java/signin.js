let canvas;

let selection = document.querySelector(".selection");

let pickedColor = [255/2, 255/2, 255/2];
let directions = [];
let step = 100;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent(document.querySelector('.colorPicker'));
    pixelDensity(1);
    noStroke();
}

function draw() {
    directions = [];
    var tr = pickedColor[0];
    var tg = pickedColor[1];
    var tb = pickedColor[2];
    directions.push(color(tr-step, tg-step, tb     )); 
    directions.push(color(tr     , tg-step, tb-step)); 
    directions.push(color(tr+step, tg-step, tb     ));
    directions.push(color(tr-step, tg     , tb-step));
    directions.push(color(tr+step, tg     , tb+step));
    directions.push(color(tr-step, tg+step, tb     ));
    directions.push(color(tr     , tg+step, tb+step));
    directions.push(color(tr+step, tg+step, tb     ));

    beginShape(TRIANGLE_STRIP);
    fill(directions[3]);
    vertex(-width/2, 0);
    fill(directions[0]);
    vertex(-width/2, -height/2);
    fill(pickedColor);
    vertex(0, 0);
    fill(directions[1]);
    vertex(0, -height/2);
    fill(directions[4]);
    vertex(width/2, 0);
    fill(directions[2]);
    vertex(width/2, -height/2);
    endShape();
    
    beginShape(TRIANGLE_STRIP);
    fill(directions[5]);
    vertex(-width/2, height/2);
    fill(directions[3]);
    vertex(-width/2, 0);
    fill(directions[6]);
    vertex(0, height/2);
    fill(pickedColor);
    vertex(0, 0);
    fill(directions[7]);
    vertex(width/2, height/2);
    fill(directions[4]);
    vertex(width/2, 0);
    endShape();
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width) {
        if (mouseY > 0 && mouseY < height) {
            pickedColor = get(mouseX, height-mouseY);
        }
    }
    updateSelectionBG();
}

function updateSelectionBG() {
    selection.style.backgroundColor = "rgb(" +pickedColor[0]+ "," +pickedColor[1]+ "," +pickedColor[2]+ ")";
    selection.style.display = "block";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function colorSelected() {
    setCookie("userColor", pickedColor[0]+","+pickedColor[1]+","+pickedColor[2], 999);
    window.location = "profile.html";
}