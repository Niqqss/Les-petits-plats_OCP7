class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
    this.recipeCard = this.createRecipeCard();
  }

  createRecipeCard() {
    const recipeCard = document.createElement('article');
    recipeCard.className = 'recipe-card';

    const cardPlaceholder = document.createElement('div');
    cardPlaceholder.className = 'recipe-card-placeholder';
    const cardTextContainer = document.createElement('div');
    cardTextContainer.className = 'recipe-card-text-container';

    const infos = document.createElement('div');
    infos.className = 'recipe-informations';
    const howTo = document.createElement('div');
    howTo.className = 'recipe-how-to';

    const recipeName = document.createElement('h2');
    recipeName.textContent = this.recipe.name;

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = this.recipe.description;

    const ingredientsList = document.createElement('ul');
    this.recipe.ingredients.forEach(ingredient => {
      const ingredientItem = document.createElement('li');
      const ingredientName = document.createElement('span');
      ingredientName.className = 'ingredient-name';
      ingredientName.textContent = ingredient.ingredient;
      ingredientItem.appendChild(ingredientName);
      ingredientItem.innerHTML += `: ${ingredient.quantity} ${ingredient.unit || ''}`;
      ingredientsList.appendChild(ingredientItem);
    });

    const recipeTime = document.createElement('p');
    recipeTime.className = 'recipe-time';
    recipeTime.textContent = ` ${this.recipe.time} min`;
    recipeTime.insertAdjacentHTML('afterbegin', '<i class="far fa-clock"></i>');

    infos.appendChild(recipeName);
    howTo.appendChild(recipeDescription);
    howTo.appendChild(ingredientsList);
    infos.appendChild(recipeTime);

    cardTextContainer.appendChild(infos);
    cardTextContainer.appendChild(howTo);

    recipeCard.appendChild(cardPlaceholder);
    recipeCard.appendChild(cardTextContainer);

    return recipeCard;
  }

  render(container) {
    container.appendChild(this.recipeCard);
  }
}

import recipes from '../data/recipes.js';

const recipeContainer = document.querySelector('.recipes-cards-container');

recipes.forEach(recipe => {
  const recipeCard = new RecipeCard(recipe);
  recipeCard.render(recipeContainer);
});

// SUITE DU CODE

const searchInput = document.getElementById('recipe-search');

searchInput.addEventListener('keypress', function (event) {
  event.preventDefault(); // prevent form submission
});

const filterIcon = document.querySelectorAll('.filter i');

filterIcon.forEach(icon => {
  icon.addEventListener('click', () => {
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  })
})