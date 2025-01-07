import html from "html-literal";
export default state => html`
  <main>
    <canvas id="myCanvas" width="300" height="150"></canvas>
    <p>
      <button onclick="save()">Output</button>
    </p>
  </main>
`;
