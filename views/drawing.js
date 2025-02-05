/* eslint-disable prettier/prettier */
import html from "html-literal";
export default state => html`
  <main>
    <form id="uploadForm">
      <div class="center">
        <p id="drawInstructions">
          You are free-drawing.<br /><br />You will NOT be able to save/upload
          your drawing, but you can test out drawing here.<br /><br />Please
          click "Start Drawing" to get started properly.
        </p>
      </div>
      <div class="horizontal">
        <p id="toolbar">
          <input type="range" id="penSize" name="penSize" min="1" max="20" />
          <label for="penSize" id="penSizeLabel">Pen Size: 10</label>
          <label
            >Enter one of the following prompts,<br />or write your own!</label
          >
          <label id="prompts"></label>
          <label for="prompt">Prompt:</label>
          <input
            type="text"
            name="prompt"
            id="promptEnter"
            placeholder="No
          point fillin' this out!"
            pattern="[A-Za-z!]*(-)*[A-Za-z!]*"
            required
          />
          <!-- pattern="[A-Za-z]*(-)*[A-Za-z]*" -->
          <label>(The prompt is also how the monster gets its name!)</label>
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
      </div>
      <!-- <p>
        <button id="save">Save</button>
      </p> -->
      <p><input type="submit" value="Submit" class="submit" /></p>
    </form>
  </main>
`;
