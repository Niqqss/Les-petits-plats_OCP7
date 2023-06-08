import recipes from '../data/recipes.js';
import RecipeCard from './components/recipe-card.js';

import {
  toggleFilterIcon,
  ingredientFilter,
  ingredientFilterIcon,
  ingredientsListContainer,
  ingredientFilterInput,
  ingredientFilterName,
} from './components/filters.js';  

const recipeCardsContainer = document.querySelector('.recipes-cards-container');

recipes.forEach(recipe => {
  const recipeCard = new RecipeCard(recipe);
  recipeCard.render(recipeCardsContainer);
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

// when the user selects a filter

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

// sortinf function

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

// when the user types in the filters search bar

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

// main search bar

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
        matchingCards = [];
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

      updateMatchingTags(displayedCards, recipes, matchingTags, allTags, remainingFilters);
    }
  }

  appendNoMatchMessageIfEmpty();

});

function updateMatchingCards(recipeCard, keywords, matchingCards, nonMatchingCards, remainingFilters) {
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