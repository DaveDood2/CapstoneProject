import html from "html-literal";

export default state => html`
  <p id="monsterName">
    The ${state.monster.word0} ${state.monster.word1} ${state.monster.word2}
  </p>
  <canvas class="canvas" id="displayCanvas" width="300" height="450"></canvas>
  <p id="artists">
    Created by: ${state.monster.name0}, ${state.monster.name1}, and
    ${state.monster.name2}
  </p>
`;

{
  /* <table id="pizzas">
<tr>
  <th>Crust</th>
  <th>Cheese</th>
  <th>Sauce</th>
  <th>Toppings</th>
  <th>Customer</th>
</tr>
${state.pizzas
  .map(pizza => {
    return `<tr><td>${pizza.crust}</td><td>${pizza.cheese}</td><td>${
      pizza.sauce
    }</td><td>${pizza.toppings.join(" & ")}</td><td>${
      pizza.customer
    }</td></tr>`;
  })
  .join("")}
</table> */
}
