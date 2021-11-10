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
});
