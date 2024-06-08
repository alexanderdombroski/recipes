class apiReciever {
    // Attributes
    private url: string;
    private prevPage: Stack<string> = new Stack<string>;
    private nextPage: string = "";

    // Methods
    public constructor(query: string | null = null, health: string[] = [], cuisine: string[] = [], meals: string[] = [], dishTypes: string[] = []) {
        this.url = this.buildUrl(query, health, cuisine, meals, dishTypes)
    }

    private buildUrl(query: string | null = null, health: string[] = [], cuisine: string[] = [], meals: string[] = [], dishTypes: string[] = []): string {
        // Builds and returns a API request given specific queries and filters
        let url = "https://api.edamam.com/api/recipes/v2?type=public";
        url += query ? `&q=${encodeURIComponent(query)}` : "";
        url += "&app_id=7f357a7c&app_key=8666ace39cf67605df34f424c64342e9";
        
        const addItems = (array: string[], label: String) => {
            if (array.length > 0) {
                url += `&${label}=${array.map(encodeURIComponent).join(`&${label}=`)}`;
            }
        }
        addItems(health, "health");
        addItems(cuisine, "cuisineType");
        addItems(meals, "mealType");
        addItems(dishTypes, "dishType");
        return url;
    }

    private async query(url: string | null = null): Promise<any> {
        try {
            const response = await fetch(url ? url : this.url);
            if (!response.ok) {
                throw new Error(`HTTP request failed. Status: ${response.status}`);
            }
            const json =  await response.json();
            this.nextPage = (json["_links"]?.["next"]?.["href"] as string) ?? "";
        } catch (error) {
            console.error(`Could not make HTTP request: Error: ${error}`);
            throw error;
        }  
    }

    // Accessble Query Functions
    public queryFirst(): Promise<any> | null{
        try {
            return this.query();
        } catch {
            console.log("Problem encountered in API query, returning null")
            return null
        }
    }
    public queryNext(): Promise<any> | null {
        if (this.pageRight()) {
            this.prevPage.push(this.url);
            this.url = this.nextPage;
            return this.query();
        } else {
            console.log("No more pages to query");
            return null;
        }
    }
    public queryPrev(): Promise<any> | null {
        if (this.pageLeft()) {
            this.url = this.prevPage.pop() ?? "";
            return this.query()
        } else {
            console.log("No prevous pages to query");
            return null;
        }
    }

    // Used to confirm that there are left/right pages
    public pageLeft(): boolean {
        return !this.prevPage.isEmpty()
    }
    public pageRight(): boolean {
        return this.nextPage === "" ? false : true
    }
}
