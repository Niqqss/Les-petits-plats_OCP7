import recipes from '../../data/recipes.js';

const ingredientFilter = document.querySelector('.ingredient-filter');
const ingredientFilterIcon = document.querySelector('.ingredient-filter i');
const ingredientsListContainer = document.querySelector('.ingredients-list-container');
const ingredientFilterInput = document.querySelector('.ingredient-input');

const applianceFilter = document.querySelector('.appliance-filter');
const applianceFilterIcon = document.querySelector('.appliance-filter i');
const appliancesListContainer = document.querySelector('.appliances-list-container');
const applianceFilterInput = document.querySelector('.appliance-input');

const ustensilFilter = document.querySelector('.ustensil-filter');
const ustensilFilterIcon = document.querySelector('.ustensil-filter i');
const ustensilsListContainer = document.querySelector('.ustensils-list-container');
const ustensilFilterInput = document.querySelector('.ustensil-input');

ingredientFilterIcon.addEventListener('click', () => {
    toggleFilterList(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilter);
    if (appliancesListContainer.classList.contains('visible')) {
        toggleFilterList(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilter);
    }
    if (ustensilsListContainer.classList.contains('visible')) {
        toggleFilterList(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilter);
    }
});

applianceFilterIcon.addEventListener('click', () => {
    toggleFilterList(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilter);
    if (ingredientsListContainer.classList.contains('visible')) {
        toggleFilterList(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilter);
    }
    if (ustensilsListContainer.classList.contains('visible')) {
        toggleFilterList(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilter);
    }
});

ustensilFilterIcon.addEventListener('click', () => {
    toggleFilterList(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilter);
    if (ingredientsListContainer.classList.contains('visible')) {
        toggleFilterList(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilter);
    }
    if (appliancesListContainer.classList.contains('visible')) {
        toggleFilterList(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilter);
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

export function toggleFilterList(filterIcon, listContainer, filterInput, filter) {
    filterIcon.classList.toggle('fa-chevron-down');
    filterIcon.classList.toggle('fa-chevron-up');
    listContainer.classList.toggle('visible');
    filterInput.classList.toggle('visible');
    filter.classList.toggle('expand');
}