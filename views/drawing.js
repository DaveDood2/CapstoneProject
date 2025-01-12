import html from "html-literal";
export default state => html`
  <main>
    <div id="toolbar"></div>
    <div id="canvases">
      <canvas class="canvas" id="myCanvas" width="300" height="450"></canvas>
      <p>
        <button onclick="save()">Output</button>
      </p>
    </div>
  </main>
`;
