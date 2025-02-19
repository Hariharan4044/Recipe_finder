const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const resultsContainer = document.getElementById('results');

// Event Listeners

// Trigger search on button click
searchBtn.addEventListener('click', getMealList);
// Trigger search when user presses Enter in the search input
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    getMealList();
  }
});

mealList.addEventListener('click', getMealRecipe);

recipeCloseBtn.addEventListener('click', () => {
  mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list that matches the ingredients
function getMealList(){
  let searchInputTxt = searchInput.value.trim();
  
  // Try fetching from TheMealDB first
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      let html = "";
      if(data.meals){
        // If meals found on TheMealDB, display them
        data.meals.forEach(meal => {
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
              <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
              </div>
              <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Get Recipe</a>
              </div>
            </div>
          `;
        });
        mealList.classList.remove('notFound');
        // Clear any previous Edamam results
        resultsContainer.innerHTML = "";
      } else {
        // If TheMealDB returns no meals, use the Edamam API
        const APP_ID = 'fdfc54fb';
        const APP_KEY = 'f7ccdf6932dcc53528ea2248cad02b36';
        if (searchInputTxt) {
          const apiUrl = `https://api.edamam.com/search?q=${searchInputTxt}&app_id=${APP_ID}&app_key=${APP_KEY}`;
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              displayEdamamResults(data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
        // Optionally clear TheMealDB results area
        mealList.innerHTML = "";
      }
      mealList.innerHTML = html;
    });
}

// Display results from the Edamam API
function displayEdamamResults(data) {
  resultsContainer.innerHTML = ''; // Clear previous results

  if (!data.hits || data.hits.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }
  let i = 0;
  data.hits.forEach(hit => {
    const recipe = hit.recipe;
    const recipeDiv = document.createElement('div');
    recipeDiv.innerHTML = `
      <div class="meal-item" data-index="${i}">
        <div class="meal-img">
          <img src="${recipe.image}" alt="${recipe.label}">
        </div>
        <div class="meal-name">
          <h3>${recipe.label}</h3>
          <button id="${i}" class="recipe-btn">Get Recipe</button>
        </div>
      </div>
    `;
    resultsContainer.appendChild(recipeDiv);
    i++;
  });
}

// Get recipe of the meal from TheMealDB
function getMealRecipe(e){
  e.preventDefault();
  if(e.target.classList.contains('recipe-btn')){
    // Check if the clicked button belongs to TheMealDB results
    if(e.target.parentElement.parentElement.dataset.id){
      let mealItem = e.target.parentElement.parentElement;
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
  }
}

// Create and show a modal for TheMealDB recipe
function mealRecipeModal(meal){
  meal = meal[0];
  let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Event delegation for Edamam recipe buttons in the results container
resultsContainer.addEventListener('click', function(event){
  if(event.target.classList.contains('recipe-btn')){
    let btnIndex = event.target.id;
    const APP_ID = 'fdfc54fb';
    const APP_KEY = 'f7ccdf6932dcc53528ea2248cad02b36';
    let searchInputTxt = searchInput.value.trim();

    if (searchInputTxt) {
      const apiUrl = `https://api.edamam.com/search?q=${searchInputTxt}&app_id=${APP_ID}&app_key=${APP_KEY}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          let i = 0;
          for (let hit of data.hits) {
            let recipe = hit.recipe;
            if(i == btnIndex){
              showEdamamModal(recipe);
              break;
            }
            i++;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
});

// Function to create and show an Edamam recipe modal
function showEdamamModal(recipe) {
  let container1 = document.getElementById("container1");
  if(!container1) {
    // Create the modal container if it doesn't exist
    container1 = document.createElement("div");
    container1.id = "container1";
    container1.innerHTML = `
      <h1 id="title"></h1>
      <button id="btnn"><i class="fa-solid fa-xmark"></i></button>
      <h2>Instructions:</h2>
      <p id="int"></p>
    `;
    document.body.appendChild(container1);
  }
  container1.style.display = 'block';
  document.getElementById("title").innerText = recipe.label;
  document.getElementById("int").innerText = recipe.ingredientLines.join(', ');

  // Add event listener to the close button (if not already added)
  const btnn = document.getElementById("btnn");
  btnn.addEventListener('click', function(){
    container1.style.display = 'none';
  });
}

// Optionally, close the Edamam modal when the user presses Enter
document.addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    let container1 = document.getElementById("container1");
    if(container1){
      container1.style.display = 'none';
    }
  }
});
