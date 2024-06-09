class MultiSelect {
    private readonly id: string;
    private elementList: HTMLUListElement;
    public selection: string[] = []
    private options: string[] = [];

    public constructor(id: string) {
        this.id = id;
        const element = document.getElementById(id)! as HTMLInputElement;
        this.addElement = this.addElement.bind(this);
        element.addEventListener('change', this.addElement);
        this.elementList = document.getElementById(element.getAttribute("values") ?? "")! as HTMLUListElement;
        const dataList = document.getElementById(element.getAttribute("list") ?? "")! as HTMLDataListElement;
        const options = dataList.options;
        for (let i = 0; i < options.length; i++) {
            this.options.push(options[i].value);
        }
    }

    private addElement(): void {
        const element = document.getElementById(this.id)! as HTMLInputElement;
        if (this.options.includes(element.value)) {
            this.elementList.innerHTML += `<li>${element.value}</li>`;
            this.selection.push(element.value);
        }
        element.value = "";
    }

    public clearSelection() {
        this.selection = [];
        this.elementList.innerHTML = "";
    }

}