import html from "html-literal";
export default state => html`
  <main>
    <form id="uploadForm">
      <div class="horizontal">
        <p id="toolbar">
          <input type="range" id="penSize" name="penSize" min="1" max="20" />
          <label for="penSize" id="penSizeLabel">Pen Size: 10</label>
        </p>
        <div id="canvasContainer">
          <div id="cover"></div>
          <canvas
            class="canvas"
            id="myCanvas"
            width="300"
            height="450"
          ></canvas>
        </div>
        <div>
          <p id="drawInstructions">You are drawing:<br />???</p>
        </div>
      </div>
      <!-- <p>
        <button id="save">Save</button>
      </p> -->
      <p>Random words test</p>
      <p id="prompts"></p>
      <p><input type="submit" value="Submit" class="submit" /></p>
    </form>
  </main>
`;
