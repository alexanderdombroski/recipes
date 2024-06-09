"use strict";
let currentReviever;
let selectionList = [
    new MultiSelect("health"),
    new MultiSelect("cuisine-type"),
    new MultiSelect("meal-type"),
    new MultiSelect("dish-type")
];
// Set up Event Listeners and Functions
(function initListeners() {
    document.getElementById("search")?.addEventListener('click', query);
    document.getElementById("clear")?.addEventListener('click', clear);
    document.getElementById("prev")?.addEventListener('click', prev);
    document.getElementById("next")?.addEventListener('click', next);
})();
function clear() {
    selectionList.forEach(selection => selection.clearSelection());
    const feild = document.getElementById("query");
    feild.value = "";
}
function next() {
    if (currentReviever.pageRight()) {
        updateRecipes(currentReviever.queryNext);
    }
}
function prev() {
    if (currentReviever.pageLeft()) {
        updateRecipes(currentReviever.queryPrev);
    }
}
// Load starting recipes
(async function loadStarters() {
    currentReviever = new ApiReciever("chocolate chip cookies");
    updateRecipes(currentReviever.queryFirst);
})();
async function query() {
    const filterSection = document.querySelector(".filters-section");
    const getValue = (id) => {
        const input = filterSection?.querySelector(id);
        return input?.value ?? "";
    };
    currentReviever = new ApiReciever(getValue("#query"), selectionList[0].selection, selectionList[1].selection, selectionList[2].selection, selectionList[3].selection);
    updateRecipes(currentReviever.queryFirst);
}
async function updateRecipes(queryType) {
    const data = await queryType();
    if (data) {
        const grid = document.querySelector(".recipes-grid");
        grid.innerHTML = "";
        const recipes = data["hits"];
        recipes.forEach(hit => {
            const recipe = hit["recipe"];
            grid.innerHTML += `
            <article onclick="expandCard(event)">
                <figure>
                    <img src="${recipe["image"]}" alt="${recipe["label"]}">
                </figure>
                <figcaption>${recipe["label"]}</figcaption>
                <div>
                    <ul>
                        <li>${recipe["ingredientLines"].join("</li><li>")}</li>
                    </ul>
                    <p>Instructions: <a href="${recipe["url"]}">${recipe["source"]}</a></p>
                </div>
            </article>`;
        });
    }
    else {
        console.log("No data recieved from API. Can't update pictures");
    }
}
function expandCard(event) {
    const square = event.currentTarget;
    square.classList.toggle("expanded");
}
