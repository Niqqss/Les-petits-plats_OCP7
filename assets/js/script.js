import recipes from '/assets/data/recipes.js';


// get the DOM element where you want to display the recipes
const recipeContainer = document.querySelector('.recipes-cards-container');

// loop through the array of recipes and create HTML elements to display the information
recipes.forEach(recipe => {
  // create a div element to hold the recipe information
  const recipeCard = document.createElement('article');
  recipeCard.className = "recipe-card";

  const cardPlaceholder = document.createElement('div');
  cardPlaceholder.className = "recipe-card-placeholder";
  const cardTextContainer = document.createElement('div');
  cardTextContainer.className = "recipe-card-text-container";

  const infos = document.createElement('div');
  infos.className = "recipe-informations";
  const howTo = document.createElement('div');
  howTo.className = "recipe-how-to";

  // create a heading element for the recipe name
  const recipeName = document.createElement('h2');
  recipeName.textContent = recipe.name;

  // create a paragraph element for the recipe description
  const recipeDescription = document.createElement('p');
  recipeDescription.textContent = recipe.description;

  // create a list element for the ingredients
  const ingredientsList = document.createElement('ul');
  recipe.ingredients.forEach(ingredient => {
    const ingredientItem = document.createElement('li');
    const ingredientName = document.createElement('span'); 
    ingredientName.className = "ingredient-name";
    ingredientName.textContent = ingredient.ingredient; 
    ingredientItem.appendChild(ingredientName); 
    ingredientItem.innerHTML += `: ${ingredient.quantity} ${ingredient.unit || ''}`; 
    ingredientsList.appendChild(ingredientItem);
  });

  // create a paragraph element for the cooking time
  const recipeTime = document.createElement('p');
  recipeTime.className = "recipe-time";
  recipeTime.textContent = ` ${recipe.time} min`;
  recipeTime.insertAdjacentHTML('afterbegin', '<i class="far fa-clock"></i>');

  // append all the elements to the recipe div
  infos.appendChild(recipeName);
  howTo.appendChild(recipeDescription);
  howTo.appendChild(ingredientsList);
  infos.appendChild(recipeTime);

  cardTextContainer.appendChild(infos);
  cardTextContainer.appendChild(howTo);

  recipeCard.appendChild(cardPlaceholder);
  recipeCard.appendChild(cardTextContainer);

  // append the recipe div to the container element
  recipeContainer.appendChild(recipeCard);
});