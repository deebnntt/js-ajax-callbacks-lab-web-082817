const searchForm = document.getElementById('search')
const results = document.getElementById('results')
const $delegatorDiv = $('#flexbox')
const $details = $('#details')
const $errors = $('#errors')

$(document).ready(function (){

  searchForm.addEventListener('submit', e => {
    let term = document.getElementById('search-term').value
    e.preventDefault();
    searchRepositories(term)
  })

});
function getCommits(e) {
  fetch(`https://api.github.com/repos/${e.owner}/${e.reponame}/commits`)
  .then(res => res.json())
  .then(json => showCommits(json))
}

function displayErrors(){
  const error = document.createElement("p")
  error.innerText = "I'm sorry there's been an error. Please try again"
  $errors.append(error)

}

function showCommits(json) {
  $details.empty()
  let repoHolder = document.createElement('ul')
  json.forEach(com => {
    let li = document.createElement('li')
    li.innerHTML = com.sha + '<br>' + com.commit.author.name + '<br>' + com.author.login + '<br>' + `<img src="${com.author.avatar_url}">`
    repoHolder.appendChild(li)
  })
  $details.append(repoHolder)
}

function searchRepositories(term) {
  fetch(`https://api.github.com/search/repositories?q=${term}`)
    .then( res => res.json())
    .then( json => showRepos(json)).catch(function(e){
      return displayErrors()
    })
}


function showRepos(json) {
  console.log(json)
  let repoHolder = document.createElement('ul')

  json.items.forEach( repo => {

    let li = document.createElement('li')
    let commitButton = document.createElement('button')
    let t = document.createTextNode("Commits")
    commitButton.appendChild(t)
    commitButton.setAttribute('data-id', repo.id)
    commitButton.setAttribute('data-owner', repo.owner.login)
    commitButton.setAttribute('data-repoName', repo.name)
    li.innerHTML = repo.name.toString() + '<br>' + 'description: ' + repo.description + '<br>' + `<a href="${repo.html_url}">link to repo</a>`
    repoHolder.appendChild(li)
    repoHolder.appendChild(commitButton)

  })
  results.appendChild(repoHolder)
  $delegatorDiv.delegate('button', 'click', (e) => getCommits(e.target.dataset) )
}
