import html from "html-literal";

import monsterMakerBack from "../assets/img/monsterMaker.jpg";

export default state => html`
  <main class="homePage">
    <img id="monsterMakerBack" src="${monsterMakerBack}" />
    <p id="monsterName">
      The ${state.monster.word0} ${state.monster.word1} ${state.monster.word2}
    </p>
    <div class="horizontal">
      <div id="canvasContainer">
        <canvas
          class="canvas"
          id="displayCanvas"
          width="300"
          height="450"
        ></canvas>
        <a class="prev">&#10094;</a>
        <a class="next">&#10095;</a>
      </div>
    </div>
    <p id="artists">
      Created by: ${state.monster.name0}, ${state.monster.name1}, and
      ${state.monster.name2}
    </p>
  </main>
`;
