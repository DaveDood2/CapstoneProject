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
        axios
          .get(`${process.env.API_URL}/monsters?progress=2`)
          .then(response => {
            // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
            console.log("response", response);
            let randomMonster = response.data[Math.floor(Math.random() * response.data.length)];
            store.home.monster = randomMonster;
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
            .catch(error => {
              console.log("It puked", error);
            })
          } else {
              axios
              // Make a POST request to the API to update monster
              .put(`${process.env.API_URL}/monsters/${value._id}`, value)
              .catch(error => {
                console.log("It puked", error);
            })
          }
        });
      });
      if (store.drawing.monster.progress in [0,1,2]){
        console.log("Trying to load monster:", store.drawing.monster);
        let canvas = document.querySelector("#myCanvas");
        loadDrawing(store.drawing.monster, canvas);
      } else {
        //router.navigate("/startDrawing");
      }
    }
    else if (view === "home") {
      let canvas = document.querySelector("#displayCanvas");
      loadDrawing(store.home.monster, canvas);
    }
    else if (view === "startDrawing") {
      let startDrawingForm = document.querySelector("#drawForm")
      startDrawingForm.addEventListener("submit", event => {
        event.preventDefault();
        let formData = getFormData();
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
                let randomMonster = response.data[Math.floor(Math.random() * response.data.length)];
                store.drawing.monster = randomMonster;
                console.log("Here's what the monster is so far", store.drawing.monster);
                console.assert(store.drawing.monster.progress in [0, 1], store.drawing.monster.progress);
                store.drawing.monster.progress += 1;
                store.drawing.monster["name" + store.drawing.monster.progress] = formData.get("name");
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
                console.assert(store.drawing.monster.progress in [0, 1], store.drawing.monster.progress);
                store.drawing.monster.progress += 1;
                store.drawing.monster["name" + store.drawing.monster.progress] = formData.get("name");
                loadMonster();
                //done();
              })
              .catch((error) => {
                console.log("It puked", error);
                //done();
              });
          }
        }

      });
    }
  }
});

//render();
router.on("/", () => render(store.home)).resolve();

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
        if (store.drawing.monster.progress){
          console.log("Trying to load monster:", store.drawing.monster);
          loadDrawing(store.drawing.monster, canvas);
        }
}
