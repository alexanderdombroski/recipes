class apiReciever {
    // Attributes
    private readonly url: string;

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

    public async query(): Promise<any> {
        const response = await fetch(this.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP request failed. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Could not make HTTP request: Error: ${error}`);
                throw error;
            });
    }
}
