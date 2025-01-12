let c;
let m;
let ctx;
let currentColor = "black";

function initializeCanvas() {
  c = document.getElementById("myCanvas");
  //c = document.querySelectorAll(".canvas");
  m = document.querySelector("main");

  ctx = c.getContext("2d");
  //ctx = Array.from(c).map(x => x.getContext("2d"));
  //console.log(ctx);

  document.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

  m.addEventListener("mousedown", event => {
    beginDrawing(getCursorPosition(event));
  });

  m.addEventListener("mousemove", event => {
    if (event.buttons === 1) {
      currentColor = "black";
      draw(getCursorPosition(event));
    } else if (event.buttons === 2) {
      currentColor = "white";
      draw(getCursorPosition(event));
    } else {
      endDrawing(getCursorPosition(event));
    }
  });

  m.addEventListener("mouseup", event => {
    endDrawing(getCursorPosition(event));
  });

  populatePrompts();
}

function populatePrompts() {
  let promptDisplay = document.querySelector("#prompts");
  fetch("https://random-word-form.herokuapp.com/random/adjective?count=5")
    .then(response => response.json())
    .then(json => {
      console.log(json);
      promptDisplay.innerHTML = json;
    });
}

function getCursorPosition(event) {
  const rect = c.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  //console.log("drawing at", x, y);
  return [x, y];
}

function beginDrawing(coords) {
  //console.log(coords);
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  ctx.lineWidth = 10;
}

function draw(coords) {
  ctx.lineWidth = 10;
  ctx.strokeStyle = currentColor;
  ctx.lineTo(coords[0], coords[1]);
  ctx.stroke();
}

function endDrawing(coords) {
  //ctx.closePath();
  //ctx.stroke();
  ctx.moveTo(coords[0], coords[1]);
}

function save() {
  console.log("Saving!");
  const rect = c.getBoundingClientRect();
  let img = ctx.getImageData(0, 0, rect.width, rect.height);
  //let img = ctx.getImageData(0, 0, 50, 50);
  console.log(img.data);
  printPixelData(img.data);
}

function printPixelData(imageData) {
  const rect = c.getBoundingClientRect();
  let outputString = "";
  for (let i = 0; i < imageData.length; i += 4) {
    if ((i / 4) % rect.width === 0) {
      //outputString += "\n";
    } else if (imageData[i + 3] && !imageData[i]) {
      outputString += "1";
    } else {
      outputString += "0";
    }
  }
  let monsterData = {
    portion: 0, // 0 = head, 1 = torso, 2 = legs
    width: rect.width,
    height: rect.height,
    pixelData: outputString
  };
  console.log(monsterData);
}
