const inputText = document.querySelector("#username");
const githubButton = document.querySelector(".submitButton");
const profileContainer = document.querySelector(".profileContainer");
const infoContainer = document.querySelector(".infoContainer");
// const hello = document.querySelector(".hello");
const repoClone = document.querySelector(".cloneRepo").cloneNode(true);
document.querySelector(".cloneRepo").remove();

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
function fetchUsername(usernameInput) {
  fetch(`https://api.github.com/users/${usernameInput}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    //creates the profile picture and the followings
    .then((data) => {
      const profile = document.createElement("h2");
      profile.innerHTML = `<a href=${data.html_url}>${data.login}</a>`;
      profile.className = "profileName";
      profileContainer.appendChild(profile);
      //bio
      const bio = document.createElement("div");
      bio.className = "bio";
      bio.innerHTML = `<div><p>${data.bio}.</p></div>`;
      profileContainer.appendChild(bio);
      //profile image
      const image = document.createElement("img");
      image.src = data.avatar_url;
      image.alt = "profile pic";
      image.className = "profileImage";
      profileContainer.appendChild(image);
      //followings + followers
      const follow = document.createElement("div");
      follow.className = "follow";
      profileContainer.appendChild(follow);
      //followers
      const followers = document.createElement("div");
      followers.textContent = data.following + " followers";
      follow.appendChild(followers);
      //following
      const followings = document.createElement("div");
      followings.textContent = data.followers + " following";
      follow.appendChild(followings);

      //repositories//

      fetch(data.repos_url)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          return response.json();
        })
        .then((dataRepo) => {
          const repoHeading = document.createElement("h1");
          repoHeading.innerHTML = "Repositories";

          infoContainer.appendChild(repoHeading);

          //cloning the reposotories
          for (let repo of dataRepo) {
            let newRepo = repoClone.cloneNode("true");
            let child = newRepo.children; // to make line of code smaller (instead of typing
            // newRepo.Child[] )//
            child[0].innerHTML = `<a href=${repo.html_url} target="_blank">${repo.name}</a>`; // hyper link for name of repo
            child[1].innerHTML = "Owner: ".bold() + repo.owner.login;
            child[2].innerHTML = "Description: ".bold() + repo.description;
            child[3].innerHTML =
              "Updated at: ".bold() + repo.updated_at.split("T")[0];
            child[4].innerHTML =
              "Created at: ".bold() + repo.created_at.split("T")[0];
            child[5].innerHTML = `<i class="fa fa-star"> ${repo.stargazers_count}</i>`;
            infoContainer.appendChild(newRepo);
          }
        });
    })
    .catch((error) => {
      console.log(error);
      if (error.message === "404") {
        inputText.value = `?????? Couldn't find "${usernameInput}"`;
      } else {
        inputText.value = "?????? Something went wrong";
      }
      let tempVal = inputText.value;
      setTimeout(() => {
        if (inputText.value == tempVal) inputText.value = "";
      }, 5000);
    });
}
//when the search button is clicked it clears the html and the profile to make another search
githubButton.addEventListener("click", () => {
  infoContainer.innerHTML = "";
  profileContainer.innerHTML = "";
  const usernameInput = inputText.value;
  inputText.value = "";
  if (usernameInput == "") {
    profileContainer.innerHTML = "";
    return;
  }
  fetchUsername(usernameInput);
});

fetchUsername(window.location.pathname.split("/")[2]);
