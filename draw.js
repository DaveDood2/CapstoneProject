import { map } from "lodash";
import * as store from "./store";
import { ja } from "@faker-js/faker";

let c;
let m;
let ctx;
let currentColor = "black";
let currentlyDrawing = false;
let penSize = 10;
let monsterObject = null;
let eraseToggle = false;

export function initializeCanvas() {
  c = document.getElementById("myCanvas");
  //c = document.querySelectorAll(".canvas");
  m = document.querySelector("main");

  document.getElementById("cover").addEventListener("click", event => {
    event.stopPropagation();
  });

  ctx = c.getContext("2d");

  //ctx = Array.from(c).map(x => x.getContext("2d"));
  //console.log(ctx);

  document.querySelector("#penSize").addEventListener("input", event => {
    penSize = event.target.value;
    document.querySelector(
      "#penSizeLabel"
    ).textContent = `Pen Size: ${event.target.value}`;
  });
  penSize = 10;

  document.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

  m.addEventListener("pointerdown", event => {
    beginDrawing(getCursorPosition(event));
  });

  c.addEventListener("pointermove", event => {
    if (!currentlyDrawing || event.pointerType !== "touch") return;
    if (!eraseToggle) {
      ctx.globalCompositeOperation = "source-over";
      currentColor = "black";
      draw(getCursorPosition(event));
    } else if (eraseToggle) {
      ctx.globalCompositeOperation = "destination-out";
      currentColor = "rgba(255, 255, 255, 1)";
      draw(getCursorPosition(event));
    } else {
      endDrawing(getCursorPosition(event));
    }
  });

  c.addEventListener("mousemove", event => {
    if (!currentlyDrawing) return;
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

  c.addEventListener("mouseleave", event => {
    // let coords = getCursorPosition(event);
    // ctx.moveTo(coords[0], coords[1]);
    endDrawing(getCursorPosition(event));
  });

  c.addEventListener("mouseenter", event => {
    if (event.buttons === 1 || event.buttons === 2) {
      beginDrawing(getCursorPosition(event));
    }
  });

  m.addEventListener("mouseup", event => {
    endDrawing(getCursorPosition(event));
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
  currentlyDrawing = true;
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
  currentlyDrawing = false;
}

function populatePrompts(progress) {
  let promptDisplay = document.querySelector("#prompts");
  if (!promptDisplay) return;
  let promptType = ["animal", "adjective", "noun"][progress];
  fetch(`https://random-word-form.herokuapp.com/random/${promptType}?count=5`)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      json = json.join("<br>");
      promptDisplay.innerHTML = json;
    });
  document.getElementById(
    "promptEnter"
  ).placeholder = `Enter a(n) ${promptType}!`;
}

export function saveDrawing() {
  console.log("Saving!");
  const rect = c.getBoundingClientRect();
  let img = ctx.getImageData(0, 0, c.width, c.height);
  return getPixelData(img.data);
}

export function setMonsterData(theMonsterInQuestion) {
  console.log("Setting monster data:", theMonsterInQuestion);
  monsterObject = theMonsterInQuestion;
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
  let monsterData = {
    ...monsterObject,
    //name0: store.startDrawing.artist,
    //progress: store.startDrawing.progress, // 0 = head, 1 = torso, 2 = legs
    width: c.width,
    height: c.height,
    canvas: packedString
  };
  monsterData[`word${monsterObject.progress}`] = document.getElementById(
    "promptEnter"
  ).value;
  // console.log("sending:", monsterData);
  // console.log("Already in store:", monsterObject);
  return monsterData;
}

export async function loadDrawing(monster, canvas, on_home_page = false) {
  if ([0, 1, 2].includes(monster.progress) === false) {
    console.error("Tried to load an invalid monster!");
    return;
  }
  if (on_home_page) {
    if (!monster.word1) monster.word1 = "";
    if (!monster.word2) monster.word2 = "";
    document.getElementById(
      "monsterName"
    ).innerHTML = `The ${monster.word1} ${monster.word2} ${monster.word0}`;
    document.getElementById(
      "artists"
    ).innerHTML = `Created by: ${monster.name0}, ${monster.name1}, and
      ${monster.name2}`;
  } else {
    // Adjust cover size
    let coverSize = (1 / 3) * monster.progress * 100;
    populatePrompts(monster.progress);
    document.getElementById("cover").style.height = `${coverSize}%`;
    updateDrawingInstructions(monster);
  }

  if (!monster.width || !monster.height) {
    return;
  }
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

function updateDrawingInstructions(monster) {
  let instructions = document.getElementById("drawInstructions");
  if (!instructions) return;
  let partName = ["Head", "Torso", "Legs"][monster.progress];
  let connectionInstructions = [
    `Keep the bottom of the head unclosed,
    leaving two lines just barely in the body section
    so the torso drawer knows where to continue from.`,
    `Continue the torso from the two lines the head drawer (hopefully) left you.
    Keep the bottom of the torso unclosed,
    and instead leave two lines hanging into the legs section,
    so the legs drawer knows where to continue from.`,
    `Continue drawing the legs from the two lines the torso drawer (hopefully) left you.
    Since you are the last player to draw, you can close up the bottom of the legs.`
  ][monster.progress];
  instructions.innerHTML = `You are drawing the monster's ${partName}.

  ${connectionInstructions}`;
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
