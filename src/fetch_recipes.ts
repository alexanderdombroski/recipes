class ApiReciever {
    // Attributes
    private url: string;
    private prevPage: Stack<string> = new Stack<string>;
    private nextPage: string = "";

    // Methods
    public constructor(query: string | null = null, health: string[] = [], cuisine: string[] = [], meals: string[] = [], dishTypes: string[] = []) {
        this.url = this.buildUrl(query, health, cuisine, meals, dishTypes);
        this.queryFirst = this.queryFirst.bind(this);
        this.queryPrev = this.queryPrev.bind(this);
        this.queryNext = this.queryNext.bind(this);
    }

    private buildUrl(query: string | null = null, health: string[] = [], cuisine: string[] = [], meals: string[] = [], dishTypes: string[] = []): string {
        // Builds and returns a API request given specific queries and filters
        let url = "https://api.edamam.com/api/recipes/v2?type=public";
        url += query ? `&q=${encodeURIComponent(query)}` : "";
        url += "&app_id=7f357a7c&app_key=8666ace39cf67605df34f424c64342e9";
        
        const addItems = (array: string[], label: String) => {
            array = array.filter(item => item !== "")
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

    private async query(url: string | null = null): Promise<JsonResponse> {
        try {
            const response = await fetch(url ? url : this.url);
            if (!response.ok) {
                throw new Error(`HTTP request failed. Status: ${response.status}`);
            }
            const json =  await response.json();
            this.nextPage = (json["_links"]?.["next"]?.["href"] as string) ?? "";
            return json;
        } catch (error) {
            console.error(`Could not make HTTP request: Error: ${error}`);
            throw error;
        }
    }

    // Accessble Query Functions
    public async queryFirst(): Promise<JsonResponse | null>{
        try {
            return await this.query();
        } catch (error) {
            console.log("Problem encountered in API query, returning null")
            console.error(error)
            return null
        }
    }
    public async queryNext(): Promise<JsonResponse | null> {
        if (this.pageRight()) {
            this.prevPage.push(this.url);
            this.url = this.nextPage;
            return await this.query();
        } else {
            console.log("No more pages to query");
            return null;
        }
    }
    public async queryPrev(): Promise<JsonResponse | null>  {
        if (this.pageLeft()) {
            this.url = this.prevPage.pop() ?? "";
            return await this.query()
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

// JSON formatting

interface Links {
    next?: {
        href: string;
    };
}

interface Recipe {
    label: string;
    image: string;
    "ingredientLines": string[];
}

interface Hit {
    recipe: Recipe;
}

interface JsonResponse {
    _links: Links;
    hits: Hit[];
}