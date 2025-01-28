import { map } from "lodash";
import * as store from "./store";

let c;
let m;
let ctx;
let currentColor = "black";
let penSize = 10;

export function initializeCanvas() {
  c = document.getElementById("myCanvas");
  //c = document.querySelectorAll(".canvas");
  m = document.querySelector("main");

  ctx = c.getContext("2d");

  //ctx = Array.from(c).map(x => x.getContext("2d"));
  //console.log(ctx);

  document.querySelector("#penSize").addEventListener("input", event => {
    penSize = event.target.value;
    document.querySelector(
      "#penSizeLabel"
    ).textContent = `Pen Size: ${event.target.value}`;
  });

  document.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

  m.addEventListener("mousedown", event => {
    beginDrawing(getCursorPosition(event));
  });

  m.addEventListener("mousemove", event => {
    if (event.buttons === 1) {
      ctx.globalCompositeOperation = "source-over";
      currentColor = "black";
      draw(getCursorPosition(event));
    } else if (event.buttons === 2) {
      ctx.globalCompositeOperation = "destination-out";
      currentColor = "rgba(255, 255, 255, 1)";
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
  ctx.lineWidth = penSize;
}

function draw(coords) {
  ctx.lineWidth = penSize;
  ctx.strokeStyle = currentColor;
  ctx.lineTo(coords[0], coords[1]);
  ctx.stroke();
}

function endDrawing(coords) {
  //ctx.closePath();
  //ctx.stroke();
  ctx.moveTo(coords[0], coords[1]);
}

export function saveDrawing() {
  console.log("Saving!");
  const rect = c.getBoundingClientRect();
  let img = ctx.getImageData(0, 0, c.width, c.height);
  return getPixelData(img.data);
}

async function getPixelData(imageData) {
  let outputString = "";
  for (let i = 0; i < imageData.length; i += 4) {
    if (imageData[i + 3] && !imageData[i]) {
      outputString += "1";
    } else {
      outputString += "0";
    }
  }

  let packedString = await compress(outputString);
  console.log("compressed in getPixelData:", typeof packedString);
  let monsterData = {
    ...store.drawing.monster,
    //name0: store.startDrawing.artist,
    word0: "aaaaa",
    //progress: store.startDrawing.progress, // 0 = head, 1 = torso, 2 = legs
    width: c.width,
    height: c.height,
    canvas: packedString
  };
  console.log("sending:", monsterData);
  console.log("Already in store:", store.drawing.monster);
  return monsterData;
}

export async function loadDrawing(monster, canvas) {
  console.log("Loading canvas of size:", monster.width, monster.height);
  canvas.width = monster.width;
  canvas.height = monster.height;
  let inputString = await decompressBlob(monster.canvas);
  let ctx = canvas.getContext("2d");
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let c = 0; c < inputString.length; c++) {
    if (inputString[c] === "1") {
      imgData.data[c * 4 + 0] = 0;
      imgData.data[c * 4 + 1] = 0;
      imgData.data[c * 4 + 2] = 0;
      imgData.data[c * 4 + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// Credit for (de)compressing strings:
// https://evanhahn.com/javascript-compression-streams-api-with-strings/
async function compress(data) {
  const stream = new Blob([data]).stream();
  const compressedReadableStream = stream.pipeThrough(
    new CompressionStream("gzip")
  );
  const chunks = [];
  for await (const chunk of compressedReadableStream) {
    chunks.push(chunk);
  }
  return await concatUint8Arrays(chunks);
}

async function decompressBlob(compressedData) {
  let Uint8ArrayData = [];
  Object.values(compressedData).forEach(element => {
    Uint8ArrayData.push(element);
  });

  //console.log("Compressed data in load:", compressedData);
  Uint8ArrayData = new Uint8Array(Uint8ArrayData);
  console.log("UintArray", typeof Uint8ArrayData, Uint8ArrayData);
  const stream = new Blob([Uint8ArrayData]).stream();

  const decompressedStream = stream.pipeThrough(
    new DecompressionStream("gzip")
  );

  const chunks = [];
  for await (const chunk of decompressedStream) {
    chunks.push(chunk);
  }
  const stringBytes = await concatUint8Arrays(chunks);

  return new TextDecoder().decode(stringBytes);
}

async function concatUint8Arrays(uint8arrays) {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

async function testCompression() {
  const str = "foo".repeat(1000);
  const compressedBytes = await compress(str);
  console.log(compressedBytes, typeof compressedBytes);
  const decompressed = await decompressBlob(compressedBytes);
  console.log(decompressed);
}
