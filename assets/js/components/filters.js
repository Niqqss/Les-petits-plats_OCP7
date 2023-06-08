import recipes from '../../data/recipes.js';

export function toggleFilterIcon(filterIcon, listContainer, filterInput, filterName, filter) {
    filterIcon.classList.toggle('fa-chevron-down');
    filterIcon.classList.toggle('fa-chevron-up');
    listContainer.classList.toggle('visible');
    filterInput.classList.toggle('visible');
    filterName.classList.toggle('hidden');
    filter.classList.toggle('expand');
}

export const ingredientFilter = document.querySelector('.ingredient-filter');
export const ingredientFilterIcon = document.querySelector('.ingredient-filter i');
export const ingredientsListContainer = document.querySelector('.ingredients-list-container');
export const ingredientFilterInput = document.querySelector('.ingredient-input');
export const ingredientFilterName = document.querySelector('.ingredient-filter p');

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