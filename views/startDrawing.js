//https://random-word-form.herokuapp.com/

import html from "html-literal";
export default () => html`
  <main>
    <h2>
      <form id="drawForm">
        <p>
          <label for="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Super Johnny FIGHT!"
            required
          />
        </p>
        <p>
          <label for="newOrContinue"
            >Want to create a new monster, or continue someone else's
            monster?</label
          >
          <br />
          <input
            type="radio"
            name="newOrContinue"
            id="newMonster"
            value="newMonster"
            required
          />
          <label for="newMonster">New Monster</label><br />
          <input
            type="radio"
            name="newOrContinue"
            id="continueMonster"
            value="continueMonster"
            required
          />
          <label for="continueMonster">Continue Monster</label><br />
        </p>
        <p class="showIfNew">
          <!-- <label for="sacrificialFruit"
            >New monsters require a sacrificial fruit. Choose wisely!</label
          >
          <br />

          <input
            type="radio"
            name="sacrificialFruit"
            id="grape"
            value="grape"
            required
          />
          <label for="grape">Grapes</label><br />
          <input
            type="radio"
            name="sacrificialFruit"
            id="apple"
            value="apple"
            required
          />
          <label for="apple">Apple</label><br />
          <input
            type="radio"
            name="sacrificialFruit"
            id="orange"
            value="orange"
            required
          />
          <label for="orange">Orange</label><br />
          <input
            type="radio"
            name="sacrificialFruit"
            id="banana"
            value="banana"
            required
          />
          <label for="banana">Banana</label><br />
          <input
            type="radio"
            name="sacrificialFruit"
            id="blueberry"
            value="blueberry"
            required
          />
          <label for="blueberry">Blueberry</label><br />
        </p> -->
        </p>

        <p class="showIfContinuing">
          <label for="monsterUpload"
            >Paste monster ID to continue, or leave blank to continue a random
            monster:</label
          >
          <input type="text" name="monsterUpload" />
        </p>

        <input type="submit" value="Submit" class="submit" />
      </form>
    </h2>
  </main>
`;
