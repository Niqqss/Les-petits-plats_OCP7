class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
    this.recipeCard = this.createRecipeCard();
  }

  createRecipeCard() {
    const recipeCard = document.createElement('article');
    recipeCard.className = 'recipe-card';
    recipeCard.setAttribute("data-id", `${this.recipe.id}`)
    const cardThumbnail = document.createElement('img');
    cardThumbnail.className = 'recipe-card-thumbnail';
    cardThumbnail.setAttribute("src", "assets/img/recipes/" + `${this.recipe.image}`);
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
    recipeCard.appendChild(cardThumbnail);
    recipeCard.appendChild(cardTextContainer);
    return recipeCard;
  }
  render(container) {
    container.appendChild(this.recipeCard);
  }
}

import recipes from '../data/recipes.js';

const recipeCardsContainer = document.querySelector('.recipes-cards-container');

recipes.forEach(recipe => {
  const recipeCard = new RecipeCard(recipe);
  recipeCard.render(recipeCardsContainer);
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

createList(ingredientsListContainer, recipes.flatMap(recipe => recipe.ingredients.map(i => i.ingredient)), "ingredient");
createList(appliancesListContainer, recipes.map(recipe => recipe.appliance), "appliance");
createList(ustensilsListContainer, recipes.flatMap(recipe => recipe.ustensils), "ustensil");

// SUITE

const selectedFiltersContainer = document.querySelector('.selected-filters-container');
let applianceItems = document.querySelectorAll('.appliance-item');
let ingredientItems = document.querySelectorAll('.ingredient-item');
let ustensilItems = document.querySelectorAll('.ustensil-item');

let matchingCards = [];
let nonMatchingCards = [];
let matchingTags = [];
let nonMatchingTags = [];
let displayedCards;
let matchingItems = [];

const allTags = [];
allTags.push(ingredientItems)
allTags.push(applianceItems)
allTags.push(ustensilItems)

function selectFilter(tag, tagName, filterType) {
  selectedFiltersContainer.classList.add('container-visible');
  const selectedFilter = document.createElement('span');
  selectedFilter.classList.add(tagName, 'selected-item');
  selectedFilter.textContent = tag.textContent;
  const selectedFilterIcon = document.createElement('i');
  selectedFilterIcon.className = 'fa-regular fa-circle-xmark';
  selectedFilter.appendChild(selectedFilterIcon);
  selectedFiltersContainer.appendChild(selectedFilter);
  selectedFilterIcon.addEventListener('click', () => {
    selectedFiltersContainer.removeChild(selectedFilter);
    const remainingFilters = selectedFiltersContainer.querySelectorAll(".selected-item");
    matchingCards = [];
    const keywords = primarySearchInput.value.toLowerCase().split(' ').filter(keyword => keyword.trim() !== '');
    if (remainingFilters.length === 0) {
      if (primarySearchInput.value.length > 2) {
        recipeCards.forEach(recipeCard => {
          updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters)
        });
        nonMatchingCards.forEach(nonMatchingCard => {
          nonMatchingCard.classList.add("hidden");
        });
        matchingCards.forEach(matchingCard => {
          matchingCard.classList.remove("hidden");
        });
        const noMatchElement = recipeCardsContainer.querySelector('.noRecipeMatchingMessage');
        updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement)
      } else {
        recipeCards.forEach(recipeCard => recipeCard.classList.remove("hidden"))
        matchingTags = [];
      }
    } else {
      if (primarySearchInput.value.length > 2) {
        if (displayedCards.length > 0) {
          displayedCards.forEach(recipeCard => {
            dataId = recipeCard.getAttribute('data-id');
            recipe = recipes.find(recipe => recipe.id == dataId);
            ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
            ustensils = recipe.ustensils;
            const filters = [...remainingFilters].map(filter => filter.textContent);
            if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
              matchingCards.push(recipeCard);
            }
          });
        } else {
          const noMatchElement = recipeCardsContainer.querySelector('.noRecipeMatchingMessage');
          let newMatchingCards = [];
          recipeCards.forEach(recipeCard => {
            updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters)
          });
          matchingCards.forEach(matchingCard => {
            dataId = matchingCard.getAttribute('data-id');
            recipe = recipes.find(recipe => recipe.id == dataId);
            ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
            ustensils = recipe.ustensils;
            const filters = [...remainingFilters].map(filter => filter.textContent);
            if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
              newMatchingCards.push(matchingCard)
            }
            matchingCards = newMatchingCards;
            updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement);
          });
        }
      } else {
        recipeCards.forEach(recipeCard => {
          dataId = recipeCard.getAttribute('data-id');
          recipe = recipes.find(recipe => recipe.id == dataId);
          ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
          ustensils = recipe.ustensils;
          const filters = [...remainingFilters].map(filter => filter.textContent);
          if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
            matchingCards.push(recipeCard);
          }
        });
      }
      recipeCards.forEach(card => {
        if (matchingCards.includes(card)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    }
    lookForTags(remainingFilters);
    ingredientSearch.value = "";
    applianceSearch.value = "";
    ustensilSearch.value = "";

    const filtersLists = document.querySelectorAll('.filter');
    filtersLists.forEach(filtersList => {
      appendNoMatchMessageIfEmpty();
    });

    previousMatchingCards = [];
    displayedCards.forEach(displayedCard => {
      previousMatchingCards.push(displayedCard)
    });
  });
}

function lookForTags(remainingFilters) {
  displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
  displayedCards.forEach(displayedCard => {
    dataId = displayedCard.getAttribute("data-id");
    recipe = recipes.find(recipe => recipe.id == dataId);
    ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
    ustensils = recipe.ustensils;
    allTags.forEach(tagArray => {
      tagArray.forEach(tag => {
        ingredients.forEach(ingredient => {
          if (ingredient === tag.textContent) {
            tag.classList.remove("hidden")
          }
        });
        ustensils.forEach(ustensil => {
          if (ustensil === tag.textContent) {
            tag.classList.remove("hidden")
          }
        });
        if (recipe.appliance === tag.textContent) {
          tag.classList.remove("hidden")
        }
        remainingFilters.forEach(remainingFilter => {
          if (remainingFilter.textContent === tag.textContent) {
            tag.classList.add("hidden")
          }
        });
      });
    })
  });
  nonMatchingTags = [];
  const newMatchingTags = document.querySelectorAll(".filter li:not(.hidden):not(.no-match-message)");
  matchingTags = newMatchingTags;
}

let selectedFilters;
let recipeCards = document.querySelectorAll(".recipe-card");
let dataId;
let recipe;
let ingredients;
let ustensils;

const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const ustensilList = document.querySelector(".ustensil-list");

sortRecipesAndTags(ingredientItems, ingredientList, "ingredient", "ingredient-filter");
sortRecipesAndTags(applianceItems, applianceList, "appliance", "appliance-filter");
sortRecipesAndTags(ustensilItems, ustensilList, "ustensil", "ustensil-filter");

// SORTING FUNCTION

let previousMatchingCards = [];

function sortRecipesAndTags(tags, list, tagName, filterType) {
  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      selectFilter(tag, tagName, filterType);
      const selectedTag = tag.textContent;
      selectedFilters = document.querySelectorAll(".selected-item");
      tag.classList.add("hidden");
      ingredientSearch.value = "";
      applianceSearch.value = "";
      ustensilSearch.value = "";
      lookForMatch(ingredientSearch, list, ingredientItems, selectedFilters);
      lookForMatch(ustensilSearch, list, ustensilItems, selectedFilters);
      if (selectedFilters.length > 1) {
        matchingCards = [];
      }
      if (primarySearchInput.value.length > 2) {
        matchingCards = [];
      }
      displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
      displayedCards.forEach(recipeCard => {
        dataId = recipeCard.getAttribute('data-id');
        recipe = recipes.find(recipe => recipe.id == dataId);
        ingredients = recipe.ingredients;
        ustensils = recipe.ustensils;
        ingredients.forEach(ingredient => {
          if (ingredient.ingredient === selectedTag) {
            matchingCards.push(recipeCard)
          }
        });
        if (recipe.appliance === selectedTag) {
          matchingCards.push(recipeCard);
        }
        ustensils.forEach(ustensil => {
          if (ustensil === selectedTag) {
            matchingCards.push(recipeCard)
          }
        });
      });
      nonMatchingCards = Array.from(recipeCards).filter(recipeCard => {
        return !matchingCards.includes(recipeCard);
      });
      nonMatchingCards.forEach(nonMatchingCard => {
        nonMatchingCard.classList.add("hidden");
      })
      displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
      matchingTags = [];
      matchingItems = [];
      displayedCards.forEach(displayedCard => {
        dataId = displayedCard.getAttribute('data-id')
        recipe = recipes.find(recipe => recipe.id == dataId);
        ingredients = recipe.ingredients;
        ustensils = recipe.ustensils;
        allTags.forEach(tagArray => {
          tagArray.forEach(tag => {
            ustensils.forEach(ustensil => {
              if (tag.textContent == ustensil) {
                if (!matchingItems.includes(ustensil)) {
                  matchingItems.push(ustensil)
                }
              }
            })
            ingredients.forEach(ingredient => {
              if (tag.textContent == ingredient.ingredient) {
                if (!matchingItems.includes(ingredient.ingredient)) {
                  matchingItems.push(ingredient.ingredient)
                }
              }
            })
            if (tag.textContent == recipe.appliance) {
              if (!matchingItems.includes(recipe.appliance)) {
                matchingItems.push(recipe.appliance)
              }
            }
            matchingItems.forEach(matchingItem => {
              if (matchingItem == tag.textContent) {
                if (!matchingTags.includes(tag)) {
                  matchingTags.push(tag);
                }
              }
            });
          });
        });
      })
      nonMatchingTags = []
      allTags.forEach(tagArray => {
        tagArray.forEach(tag => {
          if (!matchingTags.includes(tag)) {
            nonMatchingTags.push(tag);
          }
        });
      });
      nonMatchingTags.forEach(tag => {
        tag.classList.add("hidden")
      });

      appendNoMatchMessageIfEmpty();

      previousMatchingCards = [];
      displayedCards.forEach(displayedCard => {
        previousMatchingCards.push(displayedCard)
      });
    });
  });
}

// RECHERCHE DANS LES FILTRES PAR INPUT

const ingredientSearch = document.querySelector(".ingredient-input");
const applianceSearch = document.querySelector(".appliance-input");
const ustensilSearch = document.querySelector(".ustensil-input");

let matchingIngredients = [];
let matchingAppliances = [];
let matchingUstensils = [];

function filterItemsByInput(matchingArray, searchInput, listContainer, itemsToFilter, selectedFilters, arrayOfItems) {
  matchingTags.forEach(matchingTag => {
    if (matchingTag.classList.contains(itemsToFilter)) {
      if (!matchingArray.includes(matchingTag)) {
        matchingArray.push(matchingTag);
      }
    }
  });
  matchingArray = matchingArray.filter(item => !nonMatchingTags.includes(item));
  arrayOfItems = matchingArray;
  selectedFilters.forEach(selectedFilter => {
    arrayOfItems.forEach(item => {
      if (item.textContent === selectedFilter.textContent) {
        item.classList.add("hidden");
      }
    });
  });
  if (matchingTags.length === 0) {
    arrayOfItems = listContainer.querySelectorAll(`.${itemsToFilter}`);
  }
  lookForMatch(searchInput, listContainer, arrayOfItems, selectedFilters);
}

function lookForMatch(searchInput, itemsList, items, selectedFilters) {
  let matchFound = false;
  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
      item.classList.remove("hidden");
      if (!Array.from(selectedFilters).some(filter => filter.textContent === item.textContent)) {
        matchFound = true;
      }
    } else {
      item.classList.add("hidden");
    }
  });

  appendNoMatchMessageIfEmpty();

  items.forEach(item => {
    selectedFilters.forEach(selectedFilter => {
      if (selectedFilter.textContent === item.textContent) {
        item.classList.add("hidden");
      }
    });
  });
}

ingredientSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".ingredient.selected-item");
  filterItemsByInput(matchingIngredients, ingredientSearch, ingredientList, "ingredient-item", selectedFilters, ingredientItems);
});

applianceSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".appliance.selected-item");
  filterItemsByInput(matchingAppliances, applianceSearch, applianceList, "appliance-item", selectedFilters, applianceItems);
});

ustensilSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".ustensil.selected-item");
  filterItemsByInput(matchingUstensils, ustensilSearch, ustensilList, "ustensil-item", selectedFilters, ustensilItems);
});

// RECHERCHE PRINCIPALE
const form = document.querySelector('form');
const primarySearchInput = document.getElementById('recipe-search');

form.addEventListener("submit", (event) => {
  event.preventDefault();
})

primarySearchInput.addEventListener('input', () => {
  const remainingFilters = selectedFiltersContainer.querySelectorAll(".selected-item");
  const keywords = primarySearchInput.value.toLowerCase().split(' ').filter(keyword => keyword.trim() !== '');
  const noMatchElement = recipeCardsContainer.querySelector('.noRecipeMatchingMessage');

  displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
  displayedCards.forEach(displayedCard => {
    if (!previousMatchingCards.includes(displayedCard) === -1) {
      previousMatchingCards.push(displayedCard)
    }
  });

  if (primarySearchInput.value.length > 2) {
    if (remainingFilters.length > 0) {
      if (displayedCards.length > 0) {
        matchingCards = []
        displayedCards.forEach(displayedCard => {
          updateMatchingCards(displayedCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
        });
      } else {
        displayedCards = previousMatchingCards;
        displayedCards.forEach(displayedCard => {
          updateMatchingCards(displayedCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
        });
      }
    } else {
      recipeCards.forEach(recipeCard => {
        updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
      });
    }

    updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement);

    nonMatchingCards.forEach(nonMatchingCard => {
      nonMatchingCard.classList.add("hidden");
    });
    matchingCards.forEach(matchingCard => {
      matchingCard.classList.remove("hidden");
    });

    matchingTags = [];
    displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
    updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters);

  } else {
    if (remainingFilters.length === 0) {
      matchingCards = [];
      nonMatchingCards = [];
      matchingTags = [];
      recipeCards.forEach(recipeCard => {
        recipeCard.classList.remove("hidden");
      });
      allTags.forEach(tagArray => {
        tagArray.forEach(tag => {
          tag.classList.remove("hidden")
        });
      });
      if (noMatchElement) {
        noMatchElement.remove()
      }
    } else {
      remainingFilters.forEach(remainingFilter => {
        recipeCards.forEach(recipeCard => {
          dataId = recipeCard.getAttribute('data-id')
          recipe = recipes.find(recipe => recipe.id == dataId);
          ingredients = recipe.ingredients;
          ustensils = recipe.ustensils;
          ingredients.forEach(ingredient => {
            if (ingredient.ingredient === remainingFilter.textContent) {
              if (!matchingCards.includes(recipeCard)) {
                matchingCards.push(recipeCard)
              }
            }
          });
          if (recipe.appliance === remainingFilter.textContent) {
            matchingCards.push(recipeCard);
          }
          ustensils.forEach(ustensil => {
            if (ustensil === remainingFilter.textContent) {
              matchingCards.push(recipeCard)
            }
          });
        });
      });
      if (remainingFilters.length > 1) {
        matchingCards = [];
      }
      matchingCards.forEach(matchingCard => {
        matchingCard.classList.remove("hidden");
      });
      previousMatchingCards.forEach(previousMatchingCard => {
        previousMatchingCard.classList.remove("hidden");
      });
      if (noMatchElement) {
        noMatchElement.remove()
      }
      nonMatchingCards = [];
      matchingTags = [];
      displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
      updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters);
    }
  }

  appendNoMatchMessageIfEmpty();

});

function updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters) {
  const recipeTitle = recipeCard.querySelector(".recipe-informations h2").textContent.toLowerCase();
  const recipeIngredients = Array.from(recipeCard.querySelectorAll('.ingredient-name')).map(element => element.textContent.toLowerCase());
  const recipeDescription = recipeCard.querySelector('.recipe-how-to p').textContent.toLowerCase();

  let matchCount = 0;
  keywords.forEach(keyword => {
    if (recipeTitle.includes(keyword)) {
      matchCount++;
    } else if (recipeIngredients.some(ingredient => ingredient.includes(keyword))) {
      matchCount++;
    } else if (recipeDescription.includes(keyword)) {
      matchCount++;
    }
  });

  if (matchCount === keywords.length) {
    if (!matchingCards.includes(recipeCard)) {
      matchingCards.push(recipeCard);
      const index = nonMatchingCards.indexOf(recipeCard);
      if (index > -1) {
        nonMatchingCards.splice(index, 1);
      }
    }
  } else if (nonMatchingCards.includes(recipeCard)) {
    const index = nonMatchingCards.indexOf(recipeCard);
    if (index > -1) {
      nonMatchingCards.splice(index, 1);
    }
  } else {
    if (!matchingCards.includes(recipeCard) && !nonMatchingCards.includes(recipeCard)) {
      nonMatchingCards.push(recipeCard);
    } else if (matchingCards.includes(recipeCard)) {
      matchingCards.splice(matchingCards.indexOf(recipeCard), 1);
      nonMatchingCards.push(recipeCard);
    }
  }
}

function updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement) {
  if (!noMatchElement && matchingCards.length === 0) {
    const noRecipeMatchingMessage = document.createElement('p');
    noRecipeMatchingMessage.className = 'noRecipeMatchingMessage';
    noRecipeMatchingMessage.textContent = 'Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc';
    recipeCardsContainer.appendChild(noRecipeMatchingMessage);
  } else if (noMatchElement && matchingCards.length > 0) {
    noMatchElement.remove();
  }
}

function updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters) {
  displayedCards.forEach(displayedCard => {
    dataId = displayedCard.getAttribute('data-id')
    recipe = recipes.find(recipe => recipe.id == dataId);
    ingredients = recipe.ingredients;
    ustensils = recipe.ustensils;
    ustensils.forEach(ustensil => {
      if (!matchingTags.includes(ustensil)) {
        matchingTags.push(ustensil)
      }
    })
    ingredients.forEach(ingredient => {
      if (!matchingTags.includes(ingredient.ingredient)) {
        matchingTags.push(ingredient.ingredient)
      }
    })
    if (!matchingTags.includes(recipe.appliance)) {
      matchingTags.push(recipe.appliance)
    }
  })

  allTags.forEach(tagArray => {
    tagArray.forEach(tag => {
      if (!matchingTags.includes(tag.textContent)) {
        tag.classList.add("hidden");
      } else {
        tag.classList.remove("hidden");
        remainingFilters.forEach(remainingFilter => {
          if (tag.textContent === remainingFilter.textContent) {
            tag.classList.add("hidden");
          }
        });
      }
    });
  });
}

function createNoMatchMessage() {
  const noMatchMessage = document.createElement("li");
  noMatchMessage.textContent = "Aucun résultat";
  noMatchMessage.classList.add("no-match-message");
  return noMatchMessage;
}

function appendNoMatchMessageIfEmpty() {
  const visibleIngredientItems = ingredientList.querySelectorAll(".ingredient-item:not(.hidden)");
  const visibleApplianceItems = applianceList.querySelectorAll(".appliance-item:not(.hidden)");
  const visibleUstensilItems = ustensilList.querySelectorAll(".ustensil-item:not(.hidden)");

  const existingMessages = document.querySelectorAll(".no-match-message");
  existingMessages.forEach(message => message.remove());

  if (visibleIngredientItems.length == 0) {
    ingredientList.appendChild(createNoMatchMessage());
  }

  if (visibleApplianceItems.length == 0) {
    applianceList.appendChild(createNoMatchMessage());
  }

  if (visibleUstensilItems.length == 0) {
    ustensilList.appendChild(createNoMatchMessage());
  }
}