import html from "html-literal";
export default state => html`
  <main>
    <div class="horizontal">
      <p id="toolbar">
        <input type="range" id="penSize" name="penSize" min="1" max="20">
        <label for="penSize" id="penSizeLabel">Pen Size: 10</label>
        <button>asdfasdf</button>
        <button>asdfasdf</button>
      </p>
      <div id="canvas">
        <canvas class="canvas" id="myCanvas" width="300" height="450"></canvas>
      </div>
      <div id="drawInstructions">
        <p>You are drawing:<br>blah bloh blue</p>
      </div>
    </div>
    <p>
      <button id="save">Save</button>
    </p>
    <p>Random words test</p>
    <p id="prompts"></p>

  </main>
`;
