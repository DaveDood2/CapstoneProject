let showIfNew;
let showIfContinuing;
let submitButton;
let form;
let newOrContinueButtons;

export function initializeForm() {
  showIfNew = document.querySelector(".showIfNew");
  showIfContinuing = document.querySelector(".showIfContinuing");
  submitButton = document.querySelector(".submit");
  form = document.querySelector("#drawForm");
  newOrContinueButtons = document.querySelectorAll(
    "input[name='newOrContinue']"
  );

  showIfNew.style.display = "none";
  showIfContinuing.style.display = "none";
  submitButton.style.display = "none";

  form.addEventListener("submit", submitForm);
  newOrContinueButtons.forEach(button => {
    button.addEventListener("change", updateNewOrContinue);
  });
}

function submitForm(event) {
  console.log("Submitted form!");
  event.preventDefault();
}

export function getFormData() {
  return new FormData(document.getElementById("drawForm"));
}

function updateNewOrContinue() {
  let selection = document.querySelector("input[name='newOrContinue']:checked")
    .value;
  if (selection === "newMonster") {
    showIfNew.style.display = "block";
    showIfContinuing.style.display = "none";
  } else {
    showIfNew.style.display = "none";
    showIfContinuing.style.display = "block";
  }
  submitButton.style.display = "block";
}
