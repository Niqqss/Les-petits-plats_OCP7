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
  const userInput = primarySearchInput.value;
  const keywords = extractKeywords(userInput);
  const noMatchElement = recipeCardsContainer.querySelector('.no-recipes-matching-message');

  inputVerification(userInput, primarySearchInput)

  displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");

  if (primarySearchInput.value.length > 2) {
    if (remainingFilters.length > 0) {
      if (displayedCards.length > 0) {
        matchingCards = [];
        for (let i = 0; i < previousMatchingCards.length; i++) {
          const previousMatchingCard = previousMatchingCards[i];
          updateMatchingCards(previousMatchingCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
        }
      } else {
        displayedCards = previousMatchingCards;
        for (let i = 0; i < displayedCards.length; i++) {
          const displayedCard = displayedCards[i];
          updateMatchingCards(displayedCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
        }
      }
    } else {
      for (let i = 0; i < recipeCards.length; i++) {
        const recipeCard = recipeCards[i];
        updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters);
      }
    }

    updateNoMatchingRecipeMessage(recipeCardsContainer, matchingCards, noMatchElement);

    for (let i = 0; i < nonMatchingCards.length; i++) {
      const nonMatchingCard = nonMatchingCards[i];
      nonMatchingCard.classList.add("hidden");
    }
    for (let i = 0; i < matchingCards.length; i++) {
      const matchingCard = matchingCards[i];
      matchingCard.classList.remove("hidden");
    }

    matchingTags = [];
    matchingItems = [];
    displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
    updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters);
  } else {
    if (remainingFilters.length === 0) {
      matchingCards = [];
      nonMatchingCards = [];
      matchingTags = [];
      for (let i = 0; i < recipeCards.length; i++) {
        const recipeCard = recipeCards[i];
        recipeCard.classList.remove("hidden");
      }

      for (let i = 0; i < allTags.length; i++) {
        const tagArray = allTags[i];
        for (let j = 0; j < tagArray.length; j++) {
          const tag = tagArray[j];
          tag.classList.remove("hidden");
        }
      }

      if (noMatchElement) {
        noMatchElement.remove()
      }
    } else {
      updateMatchingCardsFromFilters(remainingFilters, recipeCards, recipes)

      if (remainingFilters.length > 1) {
        matchingCards = [];
      }
      for (let i = 0; i < matchingCards.length; i++) {
        const matchingCard = matchingCards[i];
        matchingCard.classList.remove("hidden");
      }
      for (let i = 0; i < previousMatchingCards.length; i++) {
        const previousMatchingCard = previousMatchingCards[i];
        previousMatchingCard.classList.remove("hidden");
      }

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

// extract keywords from an input string
function extractKeywords(input) {
  const keywords = [];
  let currentKeyword = '';
  let keywordsIndex = 0;

  // loop through each character
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === ' ') {
      if (currentKeyword.trim() !== '') {
        keywords[keywordsIndex] = currentKeyword.trim();
        keywordsIndex++;
      }
      currentKeyword = '';
    } else {
      currentKeyword += char;
    }
  }

  if (currentKeyword.trim() !== '') {
    keywords[keywordsIndex] = currentKeyword.trim();
    keywordsIndex++;
  }

  // truncate the array to the correct length
  keywords.length = keywordsIndex;

  return keywords;
}

function updateMatchingCardsFromFilters(remainingFilters, recipeCards, recipes) {
  const matchingCards = [];

  for (let i = 0; i < remainingFilters.length; i++) {
    const remainingFilter = remainingFilters[i];

    for (let j = 0; j < recipeCards.length; j++) {
      const recipeCard = recipeCards[j];
      const dataId = recipeCard.getAttribute('data-id');
      let recipeMatch = null;

      // find matching recipe
      for (let k = 0; k < recipes.length; k++) {
        const recipe = recipes[k];
        if (recipe.id == dataId) {
          recipeMatch = recipe;
          break;
        }
      }

      if (recipeMatch) {
        const ingredients = recipeMatch.ingredients;
        const ustensils = recipeMatch.ustensils;

        let hasMatchingIngredient = false;
        let hasMatchingAppliance = false;
        let hasMatchingUstensil = false;

        // check ingredients for match
        for (let l = 0; l < ingredients.length; l++) {
          const ingredient = ingredients[l];

          if (ingredient.ingredient === remainingFilter.textContent) {
            hasMatchingIngredient = true;
            break;
          }
        }

        // check appliance for match
        if (recipeMatch.appliance === remainingFilter.textContent) {
          hasMatchingAppliance = true;
        }

        // check ustensils for match
        for (let l = 0; l < ustensils.length; l++) {
          const ustensil = ustensils[l];

          if (ustensil === remainingFilter.textContent) {
            hasMatchingUstensil = true;
            break;
          }
        }

        // add recipeCard to matchingCards if any match is found
        if (hasMatchingIngredient || hasMatchingAppliance || hasMatchingUstensil) {
          let isCardAlreadyAdded = false;

          // check if recipeCard is already added to matchingCards
          for (let l = 0; l < matchingCards.length; l++) {
            if (matchingCards[l] === recipeCard) {
              isCardAlreadyAdded = true;
              break;
            }
          }

          if (!isCardAlreadyAdded) {
            matchingCards[matchingCards.length] = recipeCard;
          }
        }
      }
    }
  }

  return matchingCards;
}

// update matching cards & tags based on the main searchbar input
function updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards) {
  const recipeTitle = recipeCard.querySelector(".recipe-card-text-container h2").textContent.toLowerCase();
  const recipeIngredients = [];
  const ingredientElements = recipeCard.querySelectorAll('.ingredient-name');
  for (let i = 0; i < ingredientElements.length; i++) {
    const element = ingredientElements[i];
    recipeIngredients[i] = element.textContent.toLowerCase();
  }
  const recipeDescription = recipeCard.querySelector('.recipe-description').textContent.toLowerCase();

  let matchCount = 0;

  // check if string contains keyword
  function stringContains(string, keyword) {
    for (let i = 0; i <= string.length - keyword.length; i++) {
      let match = true;
      for (let j = 0; j < keyword.length; j++) {
        if (string[i + j] !== keyword[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];

    // check if keyword is in recipe title
    if (stringContains(recipeTitle, keyword)) {
      matchCount++;
    } else {
      // check if keyword is in recipe ingredients
      let ingredientMatch = false;
      for (let j = 0; j < recipeIngredients.length; j++) {
        if (stringContains(recipeIngredients[j], keyword)) {
          ingredientMatch = true;
          break;
        }
      }
      // check if keyword is in recipe ingredients or description
      if (ingredientMatch || stringContains(recipeDescription, keyword)) {
        matchCount++;
      }
    }
  }

  let matchingCardsIndex = -1;
  let nonMatchingCardsIndex = -1;

  // check if current keyword matches recipe card
  for (let i = 0; i < keywords.length; i++) {
    if (keywords[i] === recipeCard) {
      matchCount++;
      matchingCardsIndex = i;
    }
  }

  if (matchCount === keywords.length) {
    let matchingCardsIncluded = false;
    // check if recipecard is already included in the matchingCards array
    for (let j = 0; j < matchingCards.length; j++) {
      if (matchingCards[j] === recipeCard) {
        matchingCardsIncluded = true;
        break;
      }
    }
    // if not included, update the array
    if (!matchingCardsIncluded) {
      matchingCards[matchingCards.length] = recipeCard;
      nonMatchingCardsIndex = -1;
      for (let k = 0; k < nonMatchingCards.length; k++) {
        if (nonMatchingCards[k] === recipeCard) {
          nonMatchingCardsIndex = k;
          break;
        }
      }
      if (nonMatchingCardsIndex > -1) {
        for (let m = nonMatchingCardsIndex; m < nonMatchingCards.length - 1; m++) {
          nonMatchingCards[m] = nonMatchingCards[m + 1];
        }
        nonMatchingCards.length = nonMatchingCards.length - 1;
      }
    }
  } else {
    // update matchingCards and nonMatchingCards accordingly
    nonMatchingCardsIndex = -1;
    for (let n = 0; n < nonMatchingCards.length; n++) {
      if (nonMatchingCards[n] === recipeCard) {
        nonMatchingCardsIndex = n;
        break;
      }
    }
    if (nonMatchingCardsIndex > -1) {
      for (let p = nonMatchingCardsIndex; p < nonMatchingCards.length - 1; p++) {
        nonMatchingCards[p] = nonMatchingCards[p + 1];
      }
      nonMatchingCards.length = nonMatchingCards.length - 1;
    } else {
      let matchingCardsIncluded = false;
      for (let q = 0; q < matchingCards.length; q++) {
        if (matchingCards[q] === recipeCard) {
          matchingCardsIncluded = true;
          matchingCardsIndex = q;
          break;
        }
      }
      if (!matchingCardsIncluded) {
        nonMatchingCards[nonMatchingCards.length] = recipeCard;
      } else {
        for (let r = matchingCardsIndex; r < matchingCards.length - 1; r++) {
          matchingCards[r] = matchingCards[r + 1];
        }
        matchingCards.length = matchingCards.length - 1;
        nonMatchingCards[nonMatchingCards.length] = recipeCard;
      }
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
  for (let i = 0; i < displayedCards.length; i++) {
    const displayedCard = displayedCards[i];
    const dataId = displayedCard.getAttribute('data-id');
    const recipe = getRecipeById(dataId);
    const ingredients = recipe.ingredients;
    const ustensils = recipe.ustensils;

    for (let j = 0; j < allTags.length; j++) {
      const tagArray = allTags[j];
      for (let k = 0; k < tagArray.length; k++) {
        const tag = tagArray[k];

        for (let l = 0; l < ustensils.length; l++) {
          const ustensil = ustensils[l];
          if (tag.textContent == ustensil) {
            let found = false;
            for (let m = 0; m < matchingItems.length; m++) {
              if (matchingItems[m] == ustensil) {
                found = true;
                break;
              }
            }
            if (!found) {
              matchingItems[matchingItems.length] = ustensil;
            }
          }
        }

        for (let n = 0; n < ingredients.length; n++) {
          const ingredient = ingredients[n].ingredient;
          if (tag.textContent == ingredient) {
            let found = false;
            for (let m = 0; m < matchingItems.length; m++) {
              if (matchingItems[m] == ingredient) {
                found = true;
                break;
              }
            }
            if (!found) {
              matchingItems[matchingItems.length] = ingredient;
            }
          }
        }

        if (tag.textContent == recipe.appliance) {
          let found = false;
          for (let m = 0; m < matchingItems.length; m++) {
            if (matchingItems[m] == recipe.appliance) {
              found = true;
              break;
            }
          }
          if (!found) {
            matchingItems[matchingItems.length] = recipe.appliance;
          }
        }

        for (let m = 0; m < matchingItems.length; m++) {
          if (matchingItems[m] == tag.textContent) {
            let found = false;
            for (let n = 0; n < matchingTags.length; n++) {
              if (matchingTags[n] == tag) {
                found = true;
                break;
              }
            }
            if (!found) {
              matchingTags[matchingTags.length] = tag;
            }
          }
        }
      }
    }
  }

  function getRecipeById(id) {
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id == id) {
        return recipes[i];
      }
    }
    return null;
  }

  for (let i = 0; i < allTags.length; i++) {
    const tagArray = allTags[i];
    for (let j = 0; j < tagArray.length; j++) {
      const tag = tagArray[j];
      let found = false;

      for (let k = 0; k < matchingTags.length; k++) {
        if (matchingTags[k] === tag) {
          found = true;
          break;
        }
      }

      if (!found) {
        tag.classList.add("hidden");
      } else {
        tag.classList.remove("hidden");

        for (let l = 0; l < remainingFilters.length; l++) {
          const remainingFilter = remainingFilters[l];
          if (tag.textContent === remainingFilter.textContent) {
            tag.classList.add("hidden");
          }
        }
      }
    }
  }
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