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
      if (ingredient.quantity) {
        ingredientItem.innerHTML += `: ${ingredient.quantity} ${ingredient.unit || ''}`;
      }
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

// RESTE DU CODE

// RECHERCHE

const searchInput = document.getElementById('recipe-search');

searchInput.addEventListener('keypress', function (event) {
  event.preventDefault(); // prevent form submission
});

// FILTRES

// INGREDIENTS

const ingredientFilter = document.querySelector('.ingredient-filter');
const ingredientFilterIcon = document.querySelector('.ingredient-filter i');
const ingredientsListContainer = document.querySelector('.ingredients-list-container');
const ingredientFilterInput = document.querySelector('.ingredient-input');
const ingredientFilterName = document.querySelector('.ingredient-filter p');

ingredientFilterIcon.addEventListener('click', () => {
  ingredientFilterIcon.classList.toggle('fa-chevron-down');
  ingredientFilterIcon.classList.toggle('fa-chevron-up');

  ingredientsListContainer.classList.toggle('visible');
  ingredientFilterInput.classList.toggle('visible');
  ingredientFilterName.classList.toggle('hidden');
  ingredientFilter.classList.toggle('expand');

  if (appliancesListContainer.classList.contains('visible')) {
    applianceFilterIcon.classList.toggle('fa-chevron-down');
    applianceFilterIcon.classList.toggle('fa-chevron-up');

    appliancesListContainer.classList.toggle('visible');
    applianceFilterInput.classList.toggle('visible');
    applianceFilterName.classList.toggle('hidden');
    applianceFilter.classList.toggle('expand');
  }

  if (ustensilsListContainer.classList.contains('visible')) {
    ustensilFilterIcon.classList.toggle('fa-chevron-down');
    ustensilFilterIcon.classList.toggle('fa-chevron-up');

    ustensilsListContainer.classList.toggle('visible');
    ustensilFilterInput.classList.toggle('visible');
    ustensilFilterName.classList.toggle('hidden');
    ustensilFilter.classList.toggle('expand');
  }
})

const ingredientsList = document.createElement("ul");
ingredientsList.className = "ingredients-list";
ingredientsListContainer.appendChild(ingredientsList);

// REFACTORISER avec flatMap()

const ingredientSet = new Set();

recipes.forEach(recipe => {
  recipe.ingredients.forEach(ingredient => {
    ingredientSet.add(ingredient.ingredient);
  });
});

const sortedIngredients = [...ingredientSet].sort((a, b) => {
  const aNormalized = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const bNormalized = b.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return aNormalized.localeCompare(bNormalized);
});

sortedIngredients.forEach(ingredient => {
  let ingredientItem = document.createElement("li");
  ingredientItem.className = "ingredient-item";
  ingredientItem.textContent = ingredient;
  ingredientsList.append(ingredientItem);
});


// APPAREILS

const applianceFilter = document.querySelector('.appliance-filter');
const applianceFilterIcon = document.querySelector('.appliance-filter i');
const appliancesListContainer = document.querySelector('.appliances-list-container');
const applianceFilterInput = document.querySelector('.appliance-input');
const applianceFilterName = document.querySelector('.appliance-filter p');

applianceFilterIcon.addEventListener('click', () => {
  applianceFilterIcon.classList.toggle('fa-chevron-down');
  applianceFilterIcon.classList.toggle('fa-chevron-up');

  appliancesListContainer.classList.toggle('visible');
  applianceFilterInput.classList.toggle('visible');
  applianceFilterName.classList.toggle('hidden');
  applianceFilter.classList.toggle('expand');

  if (ingredientsListContainer.classList.contains('visible')) {
    ingredientFilterIcon.classList.toggle('fa-chevron-down');
    ingredientFilterIcon.classList.toggle('fa-chevron-up');

    ingredientsListContainer.classList.toggle('visible');
    ingredientFilterInput.classList.toggle('visible');
    ingredientFilterName.classList.toggle('hidden');
    ingredientFilter.classList.toggle('expand');
  }

  if (ustensilsListContainer.classList.contains('visible')) {
    ustensilFilterIcon.classList.toggle('fa-chevron-down');
    ustensilFilterIcon.classList.toggle('fa-chevron-up');

    ustensilsListContainer.classList.toggle('visible');
    ustensilFilterInput.classList.toggle('visible');
    ustensilFilterName.classList.toggle('hidden');
    ustensilFilter.classList.toggle('expand');
  }
})

const appliancesList = document.createElement("ul");
appliancesList.className = "appliances-list";
appliancesListContainer.appendChild(appliancesList);

// REFACTORISER avec flatMap()

const applianceSet = new Set();

recipes.forEach(recipe => {
  applianceSet.add(recipe.appliance);
});

const sortedAppliances = [...applianceSet].sort();

sortedAppliances.forEach(appliance => {
  let applianceItem = document.createElement("li");
  applianceItem.className = "appliance-item";
  applianceItem.textContent = appliance;
  appliancesList.append(applianceItem);
});



// USTENSILES

const ustensilFilter = document.querySelector('.ustensil-filter');
const ustensilFilterIcon = document.querySelector('.ustensil-filter i');
const ustensilsListContainer = document.querySelector('.ustensils-list-container');
const ustensilFilterInput = document.querySelector('.ustensil-input');
const ustensilFilterName = document.querySelector('.ustensil-filter p');

ustensilFilterIcon.addEventListener('click', () => {
  ustensilFilterIcon.classList.toggle('fa-chevron-down');
  ustensilFilterIcon.classList.toggle('fa-chevron-up');

  ustensilsListContainer.classList.toggle('visible');
  ustensilFilterInput.classList.toggle('visible');
  ustensilFilterName.classList.toggle('hidden');
  ustensilFilter.classList.toggle('expand');

  if (ingredientsListContainer.classList.contains('visible')) {
    ingredientFilterIcon.classList.toggle('fa-chevron-down');
    ingredientFilterIcon.classList.toggle('fa-chevron-up');

    ingredientsListContainer.classList.toggle('visible');
    ingredientFilterInput.classList.toggle('visible');
    ingredientFilterName.classList.toggle('hidden');
    ingredientFilter.classList.toggle('expand');
  }

  if (appliancesListContainer.classList.contains('visible')) {
    applianceFilterIcon.classList.toggle('fa-chevron-down');
    applianceFilterIcon.classList.toggle('fa-chevron-up');

    appliancesListContainer.classList.toggle('visible');
    applianceFilterInput.classList.toggle('visible');
    applianceFilterName.classList.toggle('hidden');
    applianceFilter.classList.toggle('expand');
  }
})

const ustensilsList = document.createElement("ul");
ustensilsList.className = "ustensils-list";
ustensilsListContainer.appendChild(ustensilsList);

// REFACTORISER avec flatMap()

const ustensilSet = new Set();

recipes.forEach(recipe => {
  recipe.ustensils.forEach(ustensil => {
    ustensilSet.add(ustensil);
  });
});

const sortedUstensils = [...ustensilSet].sort((a, b) => {
  const aNormalized = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const bNormalized = b.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return aNormalized.localeCompare(bNormalized);
});

sortedUstensils.forEach(ustensil => {
  let ustensilItem = document.createElement("li");
  ustensilItem.className = "ustensil-item";
  ustensilItem.textContent = ustensil;
  ustensilsList.append(ustensilItem);
});


// SUITE

const selectedFiltersContainer = document.querySelector('.selected-filters-container');
const applianceItems = document.querySelectorAll('.appliance-item');

applianceItems.forEach(applianceListItem => {
  applianceListItem.addEventListener('click', () => {
    selectedFiltersContainer.classList.add("container-visible");
    const selectedFilter = document.createElement('span');
    selectedFilter.className = "appliance-selected-item";
    selectedFilter.textContent = applianceListItem.textContent;
    const selectedFilterIcon = document.createElement('i');
    selectedFilterIcon.className = "fa-regular fa-circle-xmark";
    selectedFilter.appendChild(selectedFilterIcon);
    selectedFiltersContainer.appendChild(selectedFilter);

    selectedFilterIcon.addEventListener('click', () => {
      selectedFiltersContainer.removeChild(selectedFilter);
    })
  })
});

const ingredientItems = document.querySelectorAll('.ingredient-item');

ingredientItems.forEach(ingredientListItem => {
  ingredientListItem.addEventListener('click', () => {
    selectedFiltersContainer.classList.add("container-visible");
    const selectedFilter = document.createElement('span');
    selectedFilter.className = "ingredient-selected-item";
    selectedFilter.textContent = ingredientListItem.textContent;
    const selectedFilterIcon = document.createElement('i');
    selectedFilterIcon.className = "fa-regular fa-circle-xmark";
    selectedFilter.appendChild(selectedFilterIcon);
    selectedFiltersContainer.appendChild(selectedFilter);

    selectedFilterIcon.addEventListener('click', () => {
      selectedFiltersContainer.removeChild(selectedFilter);
    })
  })
})

const ustensilItems = document.querySelectorAll('.ustensil-item');

ustensilItems.forEach(ustensilListItem => {
  ustensilListItem.addEventListener('click', () => {
    selectedFiltersContainer.classList.add("container-visible");
    const selectedFilter = document.createElement('span');
    selectedFilter.className = "ustensil-selected-item";
    selectedFilter.textContent = ustensilListItem.textContent;
    const selectedFilterIcon = document.createElement('i');
    selectedFilterIcon.className = "fa-regular fa-circle-xmark";
    selectedFilter.appendChild(selectedFilterIcon);
    selectedFiltersContainer.appendChild(selectedFilter);

    selectedFilterIcon.addEventListener('click', () => {
      selectedFiltersContainer.removeChild(selectedFilter);
    })
  })
})

