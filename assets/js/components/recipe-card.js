export default class RecipeCard {
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
        const recipeName = document.createElement('h2');
        recipeName.textContent = this.recipe.name;
        const recipeDescriptionTitle = document.createElement('h3');
        recipeDescriptionTitle.textContent = "recette";
        const recipeDescription = document.createElement('p');
        recipeDescription.className = "recipe-description";
        recipeDescription.textContent = this.recipe.description;
        const recipeIngredientsTitle = document.createElement('h3');
        recipeIngredientsTitle.textContent = "ingrédients";
        const ingredientsList = document.createElement('div');
        ingredientsList.className = "ingredients-list";
        this.recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('div');
            const ingredientName = document.createElement('span');
            ingredientItem.className = "recipe-ingredient";
            ingredientName.className = 'ingredient-name';
            ingredientName.textContent = ingredient.ingredient;
            ingredientItem.appendChild(ingredientName);
            if (ingredient.quantity) {
                ingredientItem.innerHTML += `${ingredient.quantity} ${ingredient.unit || ''}`;
            }
            ingredientsList.appendChild(ingredientItem);
        });
        const recipeTime = document.createElement('p');
        recipeTime.className = 'recipe-time';
        recipeTime.textContent = `${this.recipe.time} min`;
        cardTextContainer.appendChild(recipeName);
        cardTextContainer.appendChild(recipeDescriptionTitle);
        cardTextContainer.appendChild(recipeDescription);
        cardTextContainer.appendChild(recipeIngredientsTitle);
        cardTextContainer.appendChild(ingredientsList);
        recipeCard.appendChild(recipeTime);
        recipeCard.appendChild(cardThumbnail);
        recipeCard.appendChild(cardTextContainer);
        return recipeCard;
    }
    render(container) {
        container.appendChild(this.recipeCard);
    }
}
