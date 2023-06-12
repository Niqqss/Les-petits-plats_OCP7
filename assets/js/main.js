import recipes from '../data/recipes.js';
import RecipeCard from './components/recipe-card.js';

import { toggleFilterList } from './components/filters.js';

const recipeCardsContainer = document.querySelector('.recipes-cards-container');

function displayCard(recipe) {
  const recipeCard = new RecipeCard(recipe);
  recipeCard.render(recipeCardsContainer);
}

recipes.forEach(recipe => {
  displayCard(recipe)
});

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

let recipesCounter = document.querySelector('.recipes-counter');

// creates DOM when filter is selected
function selectFilter(tag, tagName) {
  selectedFiltersContainer.classList.add('container-visible');
  const selectedFilter = document.createElement('span');
  selectedFilter.classList.add(tagName, 'selected-item');
  selectedFilter.textContent = tag.textContent;
  const selectedFilterIcon = document.createElement('i');
  selectedFilterIcon.className = 'fa-solid fa-xmark';
  selectedFilter.appendChild(selectedFilterIcon);
  selectedFiltersContainer.appendChild(selectedFilter);

  // behavior when filter is removed
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
        const noMatchElement = recipeCardsContainer.querySelector('.no-recipes-matching-message');
        updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement)
      } else {
        recipeCards.forEach(recipeCard => recipeCard.classList.remove("hidden"))
        matchingTags = [];
      }
    } else {
      if (primarySearchInput.value.length > 2) {
        if (displayedCards.length > 0) {
          recipeCards.forEach(recipeCard => {
            updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters)
          });
          matchingCards = filterMatchingCards(matchingCards, recipes, remainingFilters);
        } else {
          const noMatchElement = recipeCardsContainer.querySelector('.no-recipes-matching-message');
          recipeCards.forEach(recipeCard => {
            updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters)
          });
          matchingCards = filterMatchingCards(matchingCards, recipes, remainingFilters);
          updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement);
        }
      } else {
        filterAllCards(recipeCards, recipes, remainingFilters);
      }

      recipeCards.forEach(recipeCard => {
        if (matchingCards.includes(recipeCard)) {
          recipeCard.classList.remove("hidden");
        } else {
          recipeCard.classList.add("hidden");
        }
      });
    }

    lookForMatchingTags(remainingFilters);
    ingredientSearch.value = "";
    applianceSearch.value = "";
    ustensilSearch.value = "";

    appendNoMatchMessageIfEmpty();

    previousMatchingCards = [];
    displayedCards.forEach(displayedCard => {
      previousMatchingCards.push(displayedCard)
    });

    recipesCounter.textContent = displayedCards.length;
  });
}

function filterMatchingCards(matchingCards, recipes, remainingFilters) {
  let newMatchingCards = [];

  matchingCards.forEach(matchingCard => {
    const dataId = matchingCard.getAttribute('data-id');
    const recipe = recipes.find(recipe => recipe.id == dataId);
    const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
    const ustensils = recipe.ustensils;
    const filters = [...remainingFilters].map(filter => filter.textContent);

    if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
      newMatchingCards.push(matchingCard);
    }
  });

  return newMatchingCards;
}

function filterAllCards(recipeCards, recipes, remainingFilters) {

  recipeCards.forEach(recipeCard => {
    const dataId = recipeCard.getAttribute('data-id');
    const recipe = recipes.find(recipe => recipe.id == dataId);
    const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
    const ustensils = recipe.ustensils;
    const filters = [...remainingFilters].map(filter => filter.textContent);

    if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
      matchingCards.push(recipeCard);
    }
  });

  return matchingCards;
}

function lookForMatchingTags(remainingFilters) {
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

// filter selection behavior
let previousMatchingCards = [];

function sortRecipesAndTags(tags, list, tagName) {
  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      selectFilter(tag, tagName);
      const selectedTag = tag.textContent;
      selectedFilters = document.querySelectorAll(".selected-item");
      tag.classList.add("hidden");

      clearSearchInputs();
      lookForMatch(ingredientSearch, list, ingredientItems, selectedFilters);
      lookForMatch(ustensilSearch, list, ustensilItems, selectedFilters);

      if (selectedFilters.length > 1) {
        matchingCards = [];
      }
      if (primarySearchInput.value.length > 2) {
        matchingCards = [];
      }

      displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
      displayedCards.forEach(displayedCard => {
        dataId = displayedCard.getAttribute('data-id');
        recipe = recipes.find(recipe => recipe.id == dataId);
        ingredients = recipe.ingredients;
        ustensils = recipe.ustensils;
        ingredients.forEach(ingredient => {
          if (ingredient.ingredient === selectedTag) {
            matchingCards.push(displayedCard)
          }
        });
        if (recipe.appliance === selectedTag) {
          matchingCards.push(displayedCard);
        }
        ustensils.forEach(ustensil => {
          if (ustensil === selectedTag) {
            matchingCards.push(displayedCard)
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

      recipesCounter.textContent = displayedCards.length;
    });
  });
}

function clearSearchInputs() {
  ingredientSearch.value = "";
  applianceSearch.value = "";
  ustensilSearch.value = "";
}

// filters search bar behavior
const ingredientSearch = document.querySelector(".ingredient-input");
const applianceSearch = document.querySelector(".appliance-input");
const ustensilSearch = document.querySelector(".ustensil-input");

let matchingIngredients = [];
let matchingAppliances = [];
let matchingUstensils = [];

function filterItemsByInput(matchingArray, searchInput, listContainer, itemsToFilter, selectedFilters, arrayOfItems) {
  matchingArray = [];
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
  if (matchingTags.length === 0 && primarySearchInput.value.length <= 2) {
    arrayOfItems = listContainer.querySelectorAll(`.${itemsToFilter}`);
  }
  lookForMatch(searchInput, listContainer, arrayOfItems, selectedFilters);
}

function lookForMatch(searchInput, itemsList, items, selectedFilters) {
  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });

  items.forEach(item => {
    selectedFilters.forEach(selectedFilter => {
      if (selectedFilter.textContent === item.textContent) {
        item.classList.add("hidden");
      }
    });
  });

  appendNoMatchMessageIfEmpty();
}

ingredientSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".ingredient.selected-item");
  const userInput = ingredientSearch.value;
  inputVerification(userInput, ingredientSearch)
  filterItemsByInput(matchingIngredients, ingredientSearch, ingredientList, "ingredient-item", selectedFilters, ingredientItems);
});

applianceSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".appliance.selected-item");
  const userInput = applianceSearch.value;
  inputVerification(userInput, applianceSearch)
  filterItemsByInput(matchingAppliances, applianceSearch, applianceList, "appliance-item", selectedFilters, applianceItems);
});

ustensilSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".ustensil.selected-item");
  const userInput = ustensilSearch.value;
  inputVerification(userInput, ustensilSearch)
  filterItemsByInput(matchingUstensils, ustensilSearch, ustensilList, "ustensil-item", selectedFilters, ustensilItems);
});

// main search bar behavior
const primarySearchInput = document.getElementById('recipe-search');

primarySearchInput.addEventListener('input', () => {
  const remainingFilters = selectedFiltersContainer.querySelectorAll(".selected-item");
  const keywords = primarySearchInput.value.toLowerCase().split(' ').filter(keyword => keyword.trim() !== '');
  const noMatchElement = recipeCardsContainer.querySelector('.no-recipes-matching-message');

  const userInput = primarySearchInput.value;

  inputVerification(userInput, primarySearchInput)

  if (primarySearchInput.value.length > 2) {
    if (remainingFilters.length > 0) {
      if (displayedCards.length > 0) {
        matchingCards = [];
        previousMatchingCards.forEach(previousMatchingCard => {
          updateMatchingCards(previousMatchingCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
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
    matchingItems = [];
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
      displayedCards.forEach(displayedCard => {
        updateMatchingCards(displayedCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
      });

      updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters);
    }
  }
  appendNoMatchMessageIfEmpty();

  displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
  recipesCounter.textContent = displayedCards.length;

  // close dropdown when typing in the primary searchbar
  const openedList = document.querySelector(".expand");
  if (openedList) {
    const filterIcon = openedList.querySelector("i");
    const listContainer = openedList.querySelector("div");
    const filterInput = openedList.querySelector("input");
    toggleFilterList(filterIcon, listContainer, filterInput, openedList)
    filterInput.value = "";
  }
});

// update matching cards & tags based on the main searchbar input
function updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards) {
  const recipeTitle = recipeCard.querySelector(".recipe-card-text-container h2").textContent.toLowerCase();
  const recipeIngredients = Array.from(recipeCard.querySelectorAll('.ingredient-name')).map(element => element.textContent.toLowerCase());
  const recipeDescription = recipeCard.querySelector('.recipe-description').textContent.toLowerCase();

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
    noRecipeMatchingMessage.className = 'no-recipes-matching-message';
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

  allTags.forEach(tagArray => {
    tagArray.forEach(tag => {
      if (!matchingTags.includes(tag)) {
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

// create error message when empty filter list
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

// form handling & verification
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  })
});

function inputVerification(userInput, inputField) {
  const verificationPattern = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+$/
  if (!verificationPattern.test(userInput)) {
    inputField.setCustomValidity("La requête ne peut pas contenir de symboles")
  } else {
    inputField.setCustomValidity("");
  }
}