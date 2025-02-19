const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{

            const APP_ID = 'fdfc54fb';
            const APP_KEY = 'f7ccdf6932dcc53528ea2248cad02b36';
            
        
          let searchInputTxt = document.getElementById('search-input').value.trim();
            
                if (searchInputTxt) {
                    // Create the API request URL
                    const apiUrl = `https://api.edamam.com/search?q=${searchInputTxt}&app_id=${APP_ID}&app_key=${APP_KEY}`;
            
                    // Make an AJAX request to the Edamam API
                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            displayResults(data);

                        

                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            
            
            function displayResults(data) {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = ''; // Clear previous results
            
                if (data.hits.length === 0) {
                    resultsDiv.innerHTML = 'No results found.';
                    return;
                }
            let i=0;
                // Display the recipe results
                data.hits.forEach(hit => {
                    const recipe = hit.recipe;
                    const recipeDiv = document.createElement('div');
                    recipeDiv.innerHTML = `

                        <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${recipe.image}" alt="${recipe.label} >
                        </div>
                        <div class = "meal-name">
                            <h3>${recipe.label}</h3>
                            
                           <button id="${i}" class = "recipe-btn">Get Recipe</button>
                        </div>
                    </div>
                        
                    `;
                    resultsDiv.appendChild(recipeDiv);
                    i++;
                });
            }

            // html = "Sorry, we didn't find any meal!";
            // mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
const btnresult=document.getElementById("results")
btnresult.addEventListener('click',function(event){
    if(event.type!=="ENTER"){
    let container2=document.createElement("div");
    container2.id="container1";
    container2.innerHTML=`<h1 id="title"> </h1><button id="btnn" ><i class="fa-solid fa-xmark"></i></button>
    <h2>Instructions:</h2>
    <p id="int"></p>`
    btnresult.appendChild(container2)
   
    const btndid=event.target.id;
    let explain=document.createElement("div");
    const APP_ID = 'fdfc54fb';
    const APP_KEY = 'f7ccdf6932dcc53528ea2248cad02b36';
    

  let searchInputTxt = document.getElementById('search-input').value.trim();
  let i=0 
        if (searchInputTxt) {
            // let i=0;
            // Create the API request URL
            const apiUrl = `https://api.edamam.com/search?q=${searchInputTxt}&app_id=${APP_ID}&app_key=${APP_KEY}`;
            console.log("searchInput")
            // Make an AJAX request to the Edamam API
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                
            
                    let exitLoop=false;
                    let j=0;
                    let n=Object.keys(data).length
                    // Display the recipe results
                    for (var hit of data.hits) {
                        var recipe = hit.recipe;
                        console.log(i);
                      
                        if (i == btndid) {
                            console.log("true1")
                          let cancel1 = document.getElementById("container1");
                          cancel1.style.display = 'block';
                          console.log(recipe.ingredientLines.join(', '));
                      
                          let title1 = document.getElementById("title");
                          title1.innerHTML = recipe.label;
                          
                          let Instructions1 = document.getElementById("int");
                          Instructions1.innerHTML = recipe.ingredientLines.join(', ');
                        
                         return;
                        }
                        i++;
                      }

                

                })
                .catch(error => {
                    console.error('Error:', error);
                });
                if(exitLoop){
            
                }
        }
    }

});
// function cancel(){
//     let cancel1=document.getElementById("container1");
//     cancel1.style.display='none';
// }
document.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
       
        let cancel1=document.getElementById("container1");
     cancel1.style.display='none';
     console.log("cancel")
     
               
            }
        });
        
