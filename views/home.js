import html from "html-literal";

import monsterMakerBack from "../assets/img/monsterMaker.jpg";

export default state => html`
  <main class="homePage">
    <img id="monsterMakerBack" src="${monsterMakerBack}" />
    <p id="monsterName">
      The Database is Currently Loading!<br />(This will take a while if no one
      has played in a while.)
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
      Wow that database sure is loading, huh?
    </p>
  </main>
`;
