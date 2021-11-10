const inputText = document.querySelector("#username");
const githubButton = document.querySelector(".submitButton");

if (window.location.search == "?data=incorrect") {
  setTimeout(() => {
    alert("incorrect password")
  }, 100);
}

//when you click out of the search input and back in it clears
inputText.addEventListener("focusin", () => {
  inputText.value = "";
  let lastSearched = document.querySelector(".lastSearched");
  let namesAraay = [];

  fetch("/data")
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((data) => {
      data.map((names) => {
        const namess = document.createElement("div");
        namess.innerHTML = names;
        namess.className = "lastSignedName";
        lastSearched.appendChild(namess);
      });
    })
    .catch((error) => console.error(error));

  lastSearched.addEventListener("click", (event) => {
    if (event.target == lastSearched) {
      return;
    }
    inputText.value = event.target.innerHTML;
  });

  //when you click enter it does the same affect as clicking the github button
  inputText.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      inputText.blur();
      githubButton.click();
    }
  });

  //the whole search of a github profile starts when the github button is clicked
  githubButton.addEventListener("click", () => {
    const usernameInput = inputText.value;
  })
})