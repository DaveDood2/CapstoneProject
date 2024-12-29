// import funydog from "/assets/img/dog-with-flower.jpg";

import html from "html-literal";
export default state => html`
  <header class="hero">
    <h1 class="rubik-dirt-regular">${state.header}</h1>
    <a href="start_drawing.html"
      ><i class="fa-solid fa-paintbrush"></i> Start drawing!
      <i class="fa-solid fa-paintbrush"></i
    ></a>
  </header>
`;
