const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");
const userSearched = document.getElementById("search");
const main = document.getElementById("main");
    
function getUser(username) {
  axios.get(APIURL + username)
    .then(response => {
      createUserCard(response.data);
      const data = response.data; 
      console.log("Data Received:", data); 

      return getRepos(username)
        .then(reposResponse => {
          const infoRepos = reposResponse.data; 
          console.log("Repos Received:", infoRepos); 
        });
    })
    .catch(error => { 
      if (error.response) { 
      console.log("Connection failed/not found"); {
      createErrorCard("No profile with this username");
    }
   } 
 }); 
} 

function getRepos(username) {
  return axios.get(APIURL + username + "/repos?sort=created")
    .then(response => {
      addReposToCard(response.data);
  })
    .catch(() => {
      createErrorCard("Problem fetching repos");
  });
}
    
function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
  <div class="card">
     <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
     </div>
      <div class="user-info">
          <h2>${userID}</h2>
          ${userBio}
            <ul>
              <li>${user.followers} <strong>Followers</strong></li>
              <li>${user.following} <strong>Following</strong></li>
              <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
          <div id="repos"></div> 
      </div>
  </div>
 `;
  main.innerHTML = cardHTML;
 }
    
function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
 `;
  main.innerHTML = cardHTML;
}
  
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  const repoElements = repos.slice(0, 5).map((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");
      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;
      return repoEl; 
    });
  
  reposEl.append(...repoElements);
}
  
    
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = userSearched.value.trim();
 if (user) {
 getUser(user);
 userSearched.value = "";
}
});
    