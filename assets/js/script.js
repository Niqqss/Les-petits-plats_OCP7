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

// FILTRES

function toggleFilterIcon(filterIcon, listContainer, filterInput, filterName, filter) {
  filterIcon.classList.toggle('fa-chevron-down');
  filterIcon.classList.toggle('fa-chevron-up');
  listContainer.classList.toggle('visible');
  filterInput.classList.toggle('visible');
  filterName.classList.toggle('hidden');
  filter.classList.toggle('expand');
}

const ingredientFilter = document.querySelector('.ingredient-filter');
const ingredientFilterIcon = document.querySelector('.ingredient-filter i');
const ingredientsListContainer = document.querySelector('.ingredients-list-container');
const ingredientFilterInput = document.querySelector('.ingredient-input');
const ingredientFilterName = document.querySelector('.ingredient-filter p');

ingredientFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  if (appliancesListContainer.classList.contains('visible')) {
    toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  }
  if (ustensilsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  }
});

const applianceFilter = document.querySelector('.appliance-filter');
const applianceFilterIcon = document.querySelector('.appliance-filter i');
const appliancesListContainer = document.querySelector('.appliances-list-container');
const applianceFilterInput = document.querySelector('.appliance-input');
const applianceFilterName = document.querySelector('.appliance-filter p');

applianceFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  if (ingredientsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  }
  if (ustensilsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  }
});

const ustensilFilter = document.querySelector('.ustensil-filter');
const ustensilFilterIcon = document.querySelector('.ustensil-filter i');
const ustensilsListContainer = document.querySelector('.ustensils-list-container');
const ustensilFilterInput = document.querySelector('.ustensil-input');
const ustensilFilterName = document.querySelector('.ustensil-filter p');

ustensilFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  if (ingredientsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  }
  if (appliancesListContainer.classList.contains('visible')) {
    toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  }
});

function createList(listContainer, items, itemClass) {
  const list = document.createElement("ul");
  list.className = `${itemClass}-list`;
  listContainer.appendChild(list);

  const itemSet = new Set();

  items.forEach((item) => {
    itemSet.add(item);
  });

  const sortedItems = [...itemSet].sort((a, b) => {
    const aNormalized = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const bNormalized = b.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return aNormalized.localeCompare(bNormalized);
  });

  sortedItems.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.className = `${itemClass}-item`;
    listItem.textContent = item;
    list.append(listItem);
  });
}

createList(ingredientsListContainer, recipes.flatMap(recipe => recipe.ingredients.map(i => i.ingredient)), "ingredients");
createList(appliancesListContainer, recipes.map(recipe => recipe.appliance), "appliances");
createList(ustensilsListContainer, recipes.flatMap(recipe => recipe.ustensils), "ustensils");

// SUITE

const selectedFiltersContainer = document.querySelector('.selected-filters-container');
const appliancesItems = document.querySelectorAll('.appliances-item');
const ingredientsItems = document.querySelectorAll('.ingredients-item');
const ustensilsItems = document.querySelectorAll('.ustensils-item');

function selectFilter(item, className) {
  selectedFiltersContainer.classList.add('container-visible');
  const selectedFilter = document.createElement('span');
  selectedFilter.className = className;
  selectedFilter.textContent = item.textContent;
  const selectedFilterIcon = document.createElement('i');
  selectedFilterIcon.className = 'fa-regular fa-circle-xmark';
  selectedFilter.appendChild(selectedFilterIcon);
  selectedFiltersContainer.appendChild(selectedFilter);

  selectedFilterIcon.addEventListener('click', () => {
    selectedFiltersContainer.removeChild(selectedFilter);
    item.classList.toggle("hidden");
    const isNoMatchMessage = document.querySelector(".no-match-message");
    if (isNoMatchMessage) {
      isNoMatchMessage.remove();
    }
  });
}

const noMatchMessage = document.createElement("li");
noMatchMessage.textContent = "Aucun résultat";
noMatchMessage.classList.add("no-match-message");

function addFilterClickListener(items, selectedClass) {
  items.forEach(item => {
    item.addEventListener('click', () => {
      selectFilter(item, selectedClass);
      item.classList.toggle("hidden");
      const parentNode = item.parentNode;

      // Check if all child elements are hidden
      const allHidden = Array.from(parentNode.children).every(child => child.classList.contains("hidden"));

      const isNoMatchMessage = document.querySelector(".no-match-message");

      if (allHidden) {
        if (!isNoMatchMessage) {
          item.parentNode.appendChild(noMatchMessage);
        }
      } else {
        if (isNoMatchMessage) {
          isNoMatchMessage.remove();
        }
      }
    });
  });
}

addFilterClickListener(appliancesItems, 'appliance-selected-item');
addFilterClickListener(ingredientsItems, 'ingredient-selected-item');
addFilterClickListener(ustensilsItems, 'ustensil-selected-item');

// ALGO
const form = document.querySelector('form');
const primarySearchInput = document.getElementById('recipe-search');
const ingredientsSearch = document.querySelector(".ingredient-input");
const ingredientsList = document.querySelector(".ingredients-list");
const appliancesSearch = document.querySelector(".appliance-input");
const appliancesList = document.querySelector(".appliances-list");
const ustensilsSearch = document.querySelector(".ustensil-input");
const ustensilsList = document.querySelector(".ustensils-list");


form.addEventListener("submit", (event) => {
  event.preventDefault();
})

primarySearchInput.addEventListener('input', () => {
  if (primarySearchInput.value.length > 2) {
    console.log(primarySearchInput.value)
  }
});

function lookForMatch(searchInput, itemsList, items) {
  let matchFound = false;

  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
      item.classList.remove("hidden");
      matchFound = true;
    } else {
      item.classList.add("hidden");
    }
  });

  const isNoMatchMessage = itemsList.querySelector(".no-match-message");

  if (!matchFound) {
    if (!isNoMatchMessage) {
      itemsList.appendChild(noMatchMessage);
    }
  } else {
    if (isNoMatchMessage) {
      isNoMatchMessage.remove();
    }
  }
}

ingredientsSearch.addEventListener('input', () => {
  lookForMatch(ingredientsSearch, ingredientsList, ingredientsItems);
});

appliancesSearch.addEventListener('input', () => {
  lookForMatch(appliancesSearch, appliancesList, appliancesItems);
});

ustensilsSearch.addEventListener('input', () => {
  lookForMatch(ustensilsSearch, ustensilsList, ustensilsItems);
});




