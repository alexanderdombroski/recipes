"use strict";
class MultiSelect {
    constructor(id) {
        this.selection = [];
        this.options = [];
        this.id = id;
        const element = document.getElementById(id);
        this.addElement = this.addElement.bind(this);
        element.addEventListener('change', this.addElement);
        this.elementList = document.getElementById(element.getAttribute("values") ?? "");
        const dataList = document.getElementById(element.getAttribute("list") ?? "");
        const options = dataList.options;
        for (let i = 0; i < options.length; i++) {
            this.options.push(options[i].value);
        }
    }
    addElement() {
        const element = document.getElementById(this.id);
        if (this.options.includes(element.value)) {
            this.elementList.innerHTML += `<li>${element.value}</li>`;
            this.selection.push(element.value);
        }
        element.value = "";
    }
    clearSelection() {
        this.selection = [];
        this.elementList.innerHTML = "";
    }
}
