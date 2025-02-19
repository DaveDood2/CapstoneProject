// TODO:
// DONE! 1. Add a way for users to retrieve IDs after submitting a monster
// DONE! 2. Add a way to submit word prompts
// DONE! 3. Make canvas cover change size based on progress
// EH!   4. Redirect users to StartDrawing if progress invalid
// DONE! 5. Add arrows for changing home monster

// root index.js

// importing all by name
import { header, nav, main, footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import axios from "axios";
import { initializeCanvas, saveDrawing, loadDrawing, setMonsterData } from "./draw";
import { getFormData, initializeForm } from "./drawForm";
import { initializeSlides } from "./slides";


const router = new Navigo("/");

function render(state = store.home) {
  console.log("Rendered:", state.view);
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.links)}
    ${main(state)}
    ${footer()}
  `;
  router.updatePageLinks();

  switch (state) {
    case store.about:
      initializeSlides();
      break;
    case store.startDrawing:
      initializeForm();
      break;
    case store.drawing:
      initializeCanvas();
      let canvas = document.querySelector("#myCanvas");
      break;
  }
}

router.hooks({
  // We pass in the `done` function to the before hook handler to allow the function to tell Navigo we are finished with the before hook.
  // The `match` parameter is the data that is passed from Navigo to the before hook handler with details about the route being accessed.
  // https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match
  before: (done, match) => {
    // We need to know what view we are on to know what data to fetch
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    // Add a switch case statement to handle multiple routes
    switch (view) {
      // Add a case for each view that needs data from an API
      case "home":
        // New Axios get request utilizing already made environment variable
        render(store.home);
        axios
          .get(`${process.env.API_URL}/monsters?progress=2`)
          .then(response => {
            // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
            store.home.monsterCount = response.data.length;
            store.home.monsterIndex = Math.floor(Math.random() * response.data.length)
            let randomMonster = response.data[store.home.monsterIndex];
            store.home.monsters = response.data;
            store.home.monster = randomMonster;
            console.log("Loaded monster #", store.home.monsterIndex, randomMonster);
            done();
          })
          .catch((error) => {
            console.log("It puked", error);
            done();
          });
          break;
      default :
        // We must call done for all views so we include default for the views that don't have cases above.
        done();
        // break is not needed since it is the last condition, if you move default higher in the stack then you should add the break statement.
    }
  },
  already: (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    render(store[view]);
  },
  after: (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    router.updatePageLinks();

    // add menu toggle to bars icon in nav bar
    // document.querySelector(".fa-bars").addEventListener("click", () => {
    //     document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    // });
    if (view === "drawing") {
      document.querySelector("#uploadForm").addEventListener("submit", event => {
        setMonsterData(store.drawing.monster)
        event.preventDefault();
        // Create a request Wbody object to send to the API
        const requestData = saveDrawing(store.drawing.monster).then((value) => {
          console.log("Here's what we're sendin':", value);
          if (value.progress === 0){
              axios
            // Make a POST request to the API to create a new monster
            .post(`${process.env.API_URL}/monsters`, value)
            .then((response) => {
              alert(`Drawing successfully submitted! The monster's ID is: ${response.data._id}, share it with a friend if you want them to continue your drawing!`);
              router.navigate("/home");
            })
            .catch(error => {
              console.log("It puked", error);
            })
          } else if ([1, 2].includes(value.progress)){
              axios
              // Make a POST request to the API to update monster
              .put(`${process.env.API_URL}/monsters/${value._id}`, value)
              .then((response) => {
                if (value.progress === 1){
                  alert(`Drawing successfully submitted! The monster's ID is: ${response.data._id}, share it with a friend if you want them to continue your drawing!`);
                } else {
                  alert(`Monster finished! Check the home page to see your handiwork!`);
                }
                router.navigate("/home");
              })
              .catch(error => {
                console.log("It puked", error);
            })
          } else {
            console.error("Trying to send monster with invalid progress:", value.progress, typeof value.progress);
          }
        });
      });
      // if (store.drawing.monster.progress in [0,1,2]){
      //   console.log("Trying to load monster:", store.drawing.monster);
      //   let canvas = document.querySelector("#myCanvas");
      //   loadDrawing(store.drawing.monster, canvas);
      // } else {
      //   //router.navigate("/startDrawing");
      // }
    }
    else if (view === "home") {
      let canvas = document.querySelector("#displayCanvas");
      loadDrawing(store.home.monster, canvas, true);
      document.querySelector(".prev").addEventListener("click", event => {
        store.home.monsterIndex -= 1;
        if (store.home.monsterIndex < 0) store.home.monsterIndex = store.home.monsterCount - 1;
        console.log("Monsters:", store.home.monsters, "index:", store.home.monsterIndex)
        loadDrawing(store.home.monsters[store.home.monsterIndex], canvas, true);
      });
      document.querySelector(".next").addEventListener("click", event => {
        store.home.monsterIndex += 1;
        if (store.home.monsterIndex >= store.home.monsterCount) store.home.monsterIndex = 0;
        loadDrawing(store.home.monsters[store.home.monsterIndex], canvas, true);
      });
    }
    else if (view === "startDrawing") {
      let startDrawingForm = document.querySelector("#drawForm");
      document.querySelector("#username").value = sessionStorage.getItem("username");
      startDrawingForm.addEventListener("submit", event => {
        event.preventDefault();
        let formData = getFormData();
        sessionStorage.setItem("username", formData.get("name"));
        if (formData.get("newOrContinue")  === "newMonster") {
          // Create a new monster
          store.drawing.monster = {
            name0: formData.get("name"),
            progress: 0
          }
          loadMonster();
        } else if (formData.get("newOrContinue") === "continueMonster"){
          if (formData.get("monsterUpload") === ""){
            // Pick an unfinished monster at random
            axios
              .get(`${process.env.API_URL}/monsters?progress=0&progress=1`)
              .then(response => {
                // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
                console.log("response", response);
                if (response.data.length === 0) {
                  // Safeguard in event that there are no unfinished monsters
                  alert("Couldn't find any unfinished monsters! Try creating a new one instead.");
                  throw new Error("Couldn't find any unfinished monsters! Try creating a new one instead.")
                }
                else {
                  let randomMonster = response.data[Math.floor(Math.random() * response.data.length)];
                store.drawing.monster = randomMonster;
                store.drawing.monster.progress += 1;
                store.drawing.monster["name" + store.drawing.monster.progress] = formData.get("name");
                }
                loadMonster();
                //done();
              })
              .catch((error) => {
                console.log("It puked", error);
                //done();
              });
          }
          else {
            // Attempt to load specific monster
            axios
              .get(`${process.env.API_URL}/monsters/${formData.get("monsterUpload")}?progress=0&progress=1`)
              .then(response => {
                // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
                console.log("response", response);
                store.drawing.monster = response.data;
                console.log("Here's what the monster is so far", store.drawing.monster);
                if (!store.drawing.monster) {
                  alert("Couldn't find a monster with that ID!")
                  throw new Error("Couldn't find a monster with that ID!");
                }
                if (![0,1].includes(store.drawing.monster.progress)) {
                  alert("That monster is already finished!")
                  throw new Error("That monster is already finished!");
                }
                store.drawing.monster.progress += 1;
                store.drawing.monster["name" + store.drawing.monster.progress] = formData.get("name");
                loadMonster();
                //done();
              })
              .catch((error) => {
                console.error("It puked", error);
                //done();
              });
          }
        }

      });
    }
  }
});

//render();
router.on("/", () => {
  render(store.home);
  router.navigate("/home");
}).resolve();


router
.on({
  "/": () => render(),
  // Use object destructuring assignment to store the data and (query)params from the Navigo match parameter
  // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
  // This reduces the number of checks that need to be performed
  ":view": (match) => {
    // Change the :view data element to camel case and remove any dashes (support for multi-word views)
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    // Determine if the view name key exists in the store object
    if (view in store) {
      render(store[view]);
    } else {
      render(store.viewNotFound);
      console.log(`View ${view} not defined`);
    }
  },
})
.resolve();

function loadMonster(){
  router.navigate("/drawing");
  setMonsterData(store.drawing.monster);
        let canvas = document.querySelector("#myCanvas");
        if ([0,1,2].includes(store.drawing.monster.progress)){
          console.log("Trying to load monster:", store.drawing.monster);
          loadDrawing(store.drawing.monster, canvas);
        }

}
