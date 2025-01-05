const c = document.getElementById("myCanvas");
const m = document.querySelector("main");
const ctx = c.getContext("2d");
let isDrawing = false;

function getCursorPosition(event) {
  const rect = c.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  //console.log("drawing at", x, y);
  return [x, y];
}

m.addEventListener("mousedown", event => {
  beginDrawing(getCursorPosition(event));
});

m.addEventListener("mousemove", event => {
  console.log("mouse down?", event.buttons);
  if (event.buttons === 1) draw(getCursorPosition(event));
  else {
    endDrawing(getCursorPosition(event));
  }
});

m.addEventListener("mouseup", event => {
  endDrawing(getCursorPosition(event));
});

function beginDrawing(coords) {
  //console.log(coords);
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  ctx.lineWidth = 10;
  isDrawing = true;
}

function draw(coords) {
  ctx.lineWidth = 10;
  isDrawing = true;
  ctx.fillStyle = "black";
  //ctx.fillRect(coords[0], coords[1], 3, 3);
  ctx.lineTo(coords[0], coords[1]);
  ctx.stroke();
}

function endDrawing(coords) {
  //ctx.closePath();
  //ctx.stroke();
  ctx.moveTo(coords[0], coords[1]);
  isDrawing = false;
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
      outputString += "\n";
    } else if (imageData[i + 3]) {
      outputString += "■";
    } else {
      outputString += "□";
    }
  }
  console.log(outputString);
}
