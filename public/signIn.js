const inputText = document.querySelector("#username");
const githubButton = document.querySelector(".submitButton");

if (window.location.search == "?data=incorrect") {
  setTimeout(() => {
    alert("incorrect password");
  }, 100);
}

//when you click enter it does the same affect as clicking the github button
inputText.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    inputText.blur();
    githubButton.click();
  }
});
