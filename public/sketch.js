// global vars
let cube, cam;

// canvas dimensions adjust on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// initial canvas state
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.style("z-index", "-1");
  canvas.position(0, 0);

  // necessary for Easy cam in p5.js
  // ---------------------------------------------------------
  Dw.EasyCam.prototype.apply = function (n) {
    var o = this.cam;
    (n = n || o.renderer),
      n &&
        ((this.camEYE = this.getPosition(this.camEYE)),
        (this.camLAT = this.getCenter(this.camLAT)),
        (this.camRUP = this.getUpVector(this.camRUP)),
        n._curCamera.camera(
          this.camEYE[0],
          this.camEYE[1],
          this.camEYE[2],
          this.camLAT[0],
          this.camLAT[1],
          this.camLAT[2],
          this.camRUP[0],
          this.camRUP[1],
          this.camRUP[2]
        ));
  };
  // ---------------------------------------------------------

  // peasy cam
  cam = createEasyCam();
  cam.setDistanceMin(275); // restrict zoom distances
  cam.setDistanceMax(550);

  cube = new Cube(3);
}

// initial cam angle offsets
let x = -0.35;
let y = -0.35;

function draw() {
  background("#24272B");
  rotateX(x);
  rotateY(y);

  cube.display();
  currentMove.update();
}

// constants
const CUBIE_SIZE = 40;
const LENGTH = 50;

// global vars
let qb = [];

class Cube {
  constructor(dim) {
    this.dim = dim;

    for (let i = -1; i < 2; i++) {
      qb[i] = [];
      for (let j = -1; j < 2; j++) {
        qb[i][j] = [];
        for (let k = -1; k < 2; k++) {
          const x = LENGTH * i;
          const y = LENGTH * j;
          const z = LENGTH * k;
          qb[i][j][k] = new Cubie(x, y, z, LENGTH);
        }
      }
    }
  }

  // create cube out of dim * dim * dim cubies
  display() {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          push();

          if (
            Math.abs(qb[i][j][k].vector.z) > 0 &&
            currentMove.z === qb[i][j][k].vector.z / LENGTH
          ) {
            rotateZ(angle);
          } else if (
            Math.abs(qb[i][j][k].vector.x) > 0 &&
            currentMove.x === qb[i][j][k].vector.x / LENGTH
          ) {
            rotateX(angle);
          } else if (
            Math.abs(qb[i][j][k].vector.y) > 0 &&
            currentMove.y === qb[i][j][k].vector.y / LENGTH
          ) {
            rotateY(angle);
          }

          qb[i][j][k].display();
          pop();
        }
      }
    }
  }
}

function turnX(xIndex, CW) {
  let configs = [];

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    qb[xIndex][a][b].config.rotateX(CW);
    configs.push(qb[xIndex][a][b].config.copy());
  }

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    if (CW) {
      qb[xIndex][a][b].config = configs[(i + order.length - 2) % order.length];
    } else {
      qb[xIndex][a][b].config = configs[(i + 2) % order.length];
    }
  }
}

function turnY(yIndex, CW) {
  let configs = [];

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    qb[a][yIndex][b].config.rotateY(CW);
    configs.push(qb[a][yIndex][b].config.copy());
  }

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    if (CW) {
      qb[a][yIndex][b].config = configs[(i + order.length - 2) % order.length];
    } else {
      qb[a][yIndex][b].config = configs[(i + 2) % order.length];
    }
  }
}

function turnZ(zIndex, CW) {
  let configs = [];

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    qb[a][b][zIndex].config.rotateZ(CW);
    configs.push(qb[a][b][zIndex].config.copy());
  }

  for (let i = 0; i < order.length; i++) {
    const a = order[i].a;
    const b = order[i].b;

    if (CW) {
      qb[a][b][zIndex].config = configs[(i + order.length - 2) % order.length];
    } else {
      qb[a][b][zIndex].config = configs[(i + 2) % order.length];
    }
  }
}

const COLORS = [
    "#ffffff", // white
    "#f5ef42", // yellow
    "#eda405", // orange
    "#fa382a", // red
    "#10e81e", // green
    "#1029e8", // blue
    "#000000", //black
  ];
  
  const U = 0;
  const D = 1;
  const L = 2;
  const R = 3;
  const F = 4;
  const B = 5;
  
  class Cubie {
    constructor(x, y, z, size) {
      this.size = size;
      this.vector = new p5.Vector(x, y, z);
      this.config = new Config();
    }
  
    display() {
      strokeWeight(2);
      push();
      translate(this.vector.x, this.vector.y, this.vector.z);
  
      const r = this.size / 2;
  
      // F / B
      beginShape();
      fill(COLORS[this.config.get(F)]);
      vertex(-r, -r, r);
      vertex(r, -r, r);
      vertex(r, r, r);
      vertex(-r, r, r);
      endShape(CLOSE);
  
      beginShape();
      fill(COLORS[this.config.get(B)]);
      vertex(-r, -r, -r);
      vertex(r, -r, -r);
      vertex(r, r, -r);
      vertex(-r, r, -r);
      endShape(CLOSE);
  
      // U / D
      beginShape();
      fill(COLORS[this.config.get(U)]);
      vertex(-r, -r, -r);
      vertex(r, -r, -r);
      vertex(r, -r, r);
      vertex(-r, -r, r);
      endShape(CLOSE);
  
      beginShape();
      fill(COLORS[this.config.get(D)]);
      vertex(-r, r, -r);
      vertex(r, r, -r);
      vertex(r, r, r);
      vertex(-r, r, r);
      endShape(CLOSE);
  
      // L / R
      beginShape();
      fill(COLORS[this.config.get(L)]);
      vertex(-r, -r, -r);
      vertex(-r, r, -r);
      vertex(-r, r, r);
      vertex(-r, -r, r);
      endShape(CLOSE);
  
      beginShape();
      fill(COLORS[this.config.get(R)]);
      vertex(r, -r, -r);
      vertex(r, r, -r);
      vertex(r, r, r);
      vertex(r, -r, r);
      endShape(CLOSE);
  
      pop();
    }
  }

  class Config {
    constructor(sides) {
      if (sides) {
        this.sides = sides;
      } else {
        this.sides = [0, 1, 2, 3, 4, 5];
      }
    }
  
    get(side) {
      return this.sides[side];
    }
  
    copy() {
      let temp = [];
      arrayCopy(this.sides, temp);
  
      return new Config(temp);
    }
  
    rotateZ(CW) {
      if (CW) {
        let temp = this.sides[U];
        this.sides[U] = this.sides[L];
        this.sides[L] = this.sides[D];
        this.sides[D] = this.sides[R];
        this.sides[R] = temp;
      } else {
        let temp = this.sides[U];
        this.sides[U] = this.sides[R];
        this.sides[R] = this.sides[D];
        this.sides[D] = this.sides[L];
        this.sides[L] = temp;
      }
    }
  
    rotateY(CW) {
      if (CW) {
        let temp = this.sides[F];
        this.sides[F] = this.sides[R];
        this.sides[R] = this.sides[B];
        this.sides[B] = this.sides[L];
        this.sides[L] = temp;
      } else {
        let temp = this.sides[R];
        this.sides[R] = this.sides[F];
        this.sides[F] = this.sides[L];
        this.sides[L] = this.sides[B];
        this.sides[B] = temp;
      }
    }
  
    rotateX(CW) {
      if (CW) {
        let temp = this.sides[U];
        this.sides[U] = this.sides[F];
        this.sides[F] = this.sides[D];
        this.sides[D] = this.sides[B];
        this.sides[B] = temp;
      } else {
        let temp = this.sides[F];
        this.sides[F] = this.sides[U];
        this.sides[U] = this.sides[B];
        this.sides[B] = this.sides[D];
        this.sides[D] = temp;
      }
    }
  }
  
  class Index {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }
  }
  
  let order = [
    new Index(-1, -1),
    new Index(0, -1),
    new Index(1, -1),
    new Index(1, 0),
    new Index(1, 1),
    new Index(0, 1),
    new Index(-1, 1),
    new Index(-1, 0),
  ];

  function keyPressed() {
    switch (keyCode) {
      case DOWN_ARROW:
        x -= 0.4;
        break;
      case UP_ARROW:
        x += 0.4;
        break;
      case LEFT_ARROW:
        y -= 0.4;
        break;
      case RIGHT_ARROW:
        y += 0.4;
        break;
    }
  
    switch (key) {
      // F and B
      case "f":
        currentMove = MOVES.FRONTP;
        currentMove.start();
        break;
      case "F":
        currentMove = MOVES.FRONT;
        currentMove.start();
        break;
      case "b":
        currentMove = MOVES.BACKP;
        currentMove.start();
        break;
      case "B":
        currentMove = MOVES.BACK;
        currentMove.start();
        break;
  
      // U and D
      case "u":
        currentMove = MOVES.UPP;
        currentMove.start();
        break;
      case "U":
        currentMove = MOVES.UP;
        currentMove.start();
        break;
      case "d":
        currentMove = MOVES.DOWNP;
        currentMove.start();
        break;
      case "D":
        currentMove = MOVES.DOWN;
        currentMove.start();
        break;
  
      // R and L
      case "r":
        currentMove = MOVES.RIGHTP;
        currentMove.start();
        break;
      case "R":
        currentMove = MOVES.RIGHT;
        currentMove.start();
        break;
      case "l":
        currentMove = MOVES.LEFTP;
        currentMove.start();
        break;
      case "L":
        currentMove = MOVES.LEFT;
        currentMove.start();
        break;
  
      // Middle layer slices
      case "s":
        turnZ(0, false);
        break;
      case "S":
        turnZ(0, true);
        break;
      case "E":
        turnY(0, false);
        break;
      case "e":
        turnY(0, true);
        break;
      case "M":
        turnX(0, false);
        break;
      case "m":
        turnX(0, true);
        break;
      case "!":
        scramble();
        break;
      case " ":
        toggleTimer();
        break;
    }
  }

  let animating = false;
let dir = 0;

let angle = 0;
let finished = false;

class Move {
  constructor(x, y, z, dir) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dir = dir;
    this.angle = angle;
    if (dir === -1) {
      this.CW = false;
    } else {
      this.CW = true;
    }
  }

  start() {
    animating = true;
  }

  update() {
    if (animating) {
      angle += this.dir * 0.04;

      if (Math.abs(angle) > HALF_PI) {
        angle = 0;
        animating = false;

        if (Math.abs(this.z) > 0) {
          turnZ(this.z, this.CW);
        } else if (Math.abs(this.x) > 0) {
          turnX(this.x, this.CW);
        } else if (Math.abs(this.y) > 0) {
          turnY(this.y, !this.CW);
        }
      }
    }
  }

  finished() {
    return finished;
  }
}

let currentMove = new Move(0, 1, 0, 1);

const MOVES = {
  DOWN: new Move(0, 1, 0, 1),
  DOWNP: new Move(0, 1, 0, -1),
  UP: new Move(0, -1, 0, -1),
  UPP: new Move(0, -1, 0, 1),
  FRONT: new Move(0, 0, 1, 1),
  FRONTP: new Move(0, 0, 1, -1),
  BACK: new Move(0, 0, -1, -1),
  BACKP: new Move(0, 0, -1, 1),
  RIGHT: new Move(1, 0, 0, 1),
  RIGHTP: new Move(1, 0, 0, -1),
  LEFT: new Move(-1, 0, 0, -1),
  LEFTP: new Move(-1, 0, 0, 1),
  L2: new Move(-1, 0, 0, 1) 
};

const MOVES_KEYS = [
  "UP",
  "UPP",
  "DOWN",
  "DOWNP",
  "FRONT",
  "FRONTP",
  "BACK",
  "BACKP",
  "RIGHT",
  "RIGHTP",
  "LEFT",
  "LEFTP",
];

function translator(moveKey) {
  switch (moveKey) {
    case "UP":
      return "U";
    case "UPP":
      return "U'";
    case "DOWN":
      return "D";
    case "DOWNP":
      return "D'";
    case "RIGHT":
      return "R";
    case "RIGHTP":
      return "R'";
    case "LEFT":
      return "L";
    case "LEFTP":
      return "L";
    case "BACK":
      return "B";
    case "BACKP":
      return "B'";
    case "FRONT":
      return "F";
    case "FRONTP":
      return "F'";
    default:
        return moveKey;
  }
}

const SCRAMBLE_LENGTH = 20;

let scrambleMoves = [];
let scrambleKeys = [];

const scrambleElement = document.getElementById("scramble");


function scramble() {
  scrambleElement.innerHTML = ""
  randomMove();
  setIntervalX(randomMove, 1200, SCRAMBLE_LENGTH - 1);
}

function randomMove() {
  let r = Math.floor(Math.random() * MOVES_KEYS.length);
  let key = MOVES_KEYS[r];
  let m = MOVES[key];
  scrambleMoves.push(m);
  scrambleKeys.push(key);
  currentMove = m;
  currentMove.start();
  scrambleElement.innerHTML += ` ${translator(key)} `;
}

function setIntervalX(callback, delay, repetitions) {
  var x = 0;
  var intervalID = setInterval(function () {
    callback();

    if (++x === repetitions) {
      window.clearInterval(intervalID);
    }
  }, delay);
}

const chooseOne = (n1,n2,n3) => {
    switch(Math.floor(Math.random() * 3)){
        case 0:
            return n1;
        case 1:
            return n2;
        case 2:
            return n3;
    }
}

function createScramble(){
    let scramble = [];

    const firstTurn = Math.floor(Math.random() * 6);
    
    scramble.push(firstTurn);
    for(let i = 1; i < SCRAMBLE_LENGTH; i++){
        let nextTurn = Math.floor(Math.random() * 6);

        while(scramble[i-1] == nextTurn){
            nextTurn = Math.floor(Math.random() * 6);
        }

        scramble.push(nextTurn);
    }

    for(let i = 0; i < SCRAMBLE_LENGTH; i++){
        if(scramble[i] == 0){
            scramble[i] = chooseOne("UP", "UPP", "U2")
        } else if(scramble[i] == 1){
            scramble[i] = chooseOne("DOWN", "DOWNP", "D2")
        } else if(scramble[i] == 2){
            scramble[i] = chooseOne("RIGHT", "RIGHTP", "R2")
        } else if(scramble[i] == 3){
            scramble[i] = chooseOne("LEFT", "LEFTP", "L2")
        } else if(scramble[i] == 4){
            scramble[i] = chooseOne("BACK", "BACKP", "B2")
        } else if(scramble[i] == 5){ 
            scramble[i] = chooseOne("FRONT", "FRONTP", "F2")
        }
    }

    return scramble;
}

createScramble();


// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML

function printx(txt) {
  document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

let started = false;

function start() {
    started = true;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    printx(timeToString(elapsedTime));
  }, 10);
}

// function pause() {
//   started = false;
//   clearInterval(timerInterval);
// }

function reset() {
  started = false;
  clearInterval(timerInterval);
//   printx("00:00:00");
  elapsedTime = 0;
}

function toggleTimer(){
    document.getElementById("display").classList.toggle("red");
    console.log(document.getElementById("display"))
    if(started){
        console.log("stop")
        const listItem = document.createElement("li")
        listItem.innerHTML = timeToString(elapsedTime)
        document.getElementById("timesList").append(listItem)
        reset()
    } else {
        console.log("start")
        start()
    }
}