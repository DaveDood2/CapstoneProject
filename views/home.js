import html from "html-literal";

export default state => html`
  <main class="homePage">
    <p id="monsterName">
      The ${state.monster.word0} ${state.monster.word1} ${state.monster.word2}
    </p>
    <div class="horizontal">
      <a class="prev">&#10094;</a>
      <div id="canvasContainer">
        <canvas
          class="canvas"
          id="displayCanvas"
          width="300"
          height="450"
        ></canvas>
      </div>
      <a class="next">&#10095;</a>
    </div>
    <p id="artists">
      Created by: ${state.monster.name0}, ${state.monster.name1}, and
      ${state.monster.name2}
    </p>
  </main>
`;
