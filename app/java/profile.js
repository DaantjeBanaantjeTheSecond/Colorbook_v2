let userColor = getCookie("userColor");
let friends = getCookie("friends");

let root = document.documentElement;

root.style.setProperty("--userColor", userColor);

let usersContainer = document.querySelector(".usersContainer");
let friendRequestBox = document.querySelector(".friendRequestBox");

let canvas;
let positions = {};
let divs = {};
let c;
let boxes;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  smooth();
  noStroke();
}

function draw() {
  c = userColor.split(",");
  background(c[0], c[1], c[2]);
  Object.keys(positions).forEach(function(key) {
    if (divs[key] === undefined) {
      if (positions[key].userColor != userColor) {
        let div = document.createElement("div");
        div.className = "userInList";
        div.style.backgroundColor = "rgba(" + positions[key].userColor + ",1)";
        usersContainer.appendChild(div);
        div.style.animation = "newUser .5s ease";
        div.addEventListener("animationend", animationEnd);
        div.addEventListener("click", sendFriendRequest);
        divs[key] = div;
      }
    }
  });
  Object.keys(divs).forEach(function(key) {
    if (positions[key] === undefined) {
      divs[key].style.animation = "userLeft .5s ease";
    }
  });
}

function sendFriendRequest() {
  let thisBG = this.style.backgroundColor;
  Object.keys(divs).forEach(function(key) {
    let divBG = divs[key].style.backgroundColor;
    if (thisBG == divBG) {
      socket.emit("friendRequest", {reciever: key, sender: userColor});
    }
  });
}

function animationEnd() {
  let thisAnimation = this.style.animationName;
  Object.keys(divs).forEach(function(key) {
    let divAnimation = divs[key].style.animationName;
    if (thisAnimation == divAnimation && thisAnimation == "userLeft") {
      usersContainer.removeChild(divs[key]);
      delete divs[key];
    }
  });
}

function removeUserAfterAnimation(key) {
  if (divs[key].style.marginLeft == "120px") {
  }
}

socket.emit("userColor", userColor);

document.addEventListener("mousemove", function(e) {
  socket.emit("mouse", {
    userColor: userColor,
    x: e.pageX,
    y: e.pageY
  });
});

socket.on("mousePositions", function(mousePositions) {
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
      };

      positions[key] = mousePos;
    }
  });

  Object.keys(positions).forEach(function(key) {
    if (mousePositions[key] === undefined) {
      delete positions[key];
    }
  });
});

socket.on("personalFriendRequest", function(data) {
  friendRequestBox.style.display = "block";
  console.log(data);
  friendRequestBox.style.backgroundColor = "rgba("+data+",1)";
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Box {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }

  display() {
    fill(255, 200, 100);
    rect(this.x, this.y, this.w, this.w);
  }
}