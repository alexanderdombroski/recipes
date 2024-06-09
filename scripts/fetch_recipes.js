"use strict";
class ApiReciever {
    // Methods
    constructor(query = null, health = [], cuisine = [], meals = [], dishTypes = []) {
        this.prevPage = new Stack;
        this.nextPage = "";
        this.url = this.buildUrl(query, health, cuisine, meals, dishTypes);
        this.queryFirst = this.queryFirst.bind(this);
        this.queryPrev = this.queryPrev.bind(this);
        this.queryNext = this.queryNext.bind(this);
    }
    buildUrl(query = null, health = [], cuisine = [], meals = [], dishTypes = []) {
        // Builds and returns a API request given specific queries and filters
        let url = "https://api.edamam.com/api/recipes/v2?type=public";
        url += query ? `&q=${encodeURIComponent(query)}` : "";
        url += "&app_id=7f357a7c&app_key=8666ace39cf67605df34f424c64342e9";
        const addItems = (array, label) => {
            array = array.filter(item => item !== "");
            if (array.length > 0) {
                url += `&${label}=${array.map(encodeURIComponent).join(`&${label}=`)}`;
            }
        };
        addItems(health, "health");
        addItems(cuisine, "cuisineType");
        addItems(meals, "mealType");
        addItems(dishTypes, "dishType");
        return url;
    }
    async query(url = null) {
        try {
            const response = await fetch(url ? url : this.url);
            if (!response.ok) {
                throw new Error(`HTTP request failed. Status: ${response.status}`);
            }
            const json = await response.json();
            this.nextPage = json["_links"]?.["next"]?.["href"] ?? "";
            return json;
        }
        catch (error) {
            console.error(`Could not make HTTP request: Error: ${error}`);
            throw error;
        }
    }
    // Accessble Query Functions
    async queryFirst() {
        try {
            return await this.query();
        }
        catch (error) {
            console.log("Problem encountered in API query, returning null");
            console.error(error);
            return null;
        }
    }
    async queryNext() {
        if (this.pageRight()) {
            this.prevPage.push(this.url);
            this.url = this.nextPage;
            return await this.query();
        }
        else {
            console.log("No more pages to query");
            return null;
        }
    }
    async queryPrev() {
        if (this.pageLeft()) {
            this.url = this.prevPage.pop() ?? "";
            return await this.query();
        }
        else {
            console.log("No prevous pages to query");
            return null;
        }
    }
    // Used to confirm that there are left/right pages
    pageLeft() {
        return !this.prevPage.isEmpty();
    }
    pageRight() {
        return this.nextPage === "" ? false : true;
    }
}
