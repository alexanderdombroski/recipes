"use strict";
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        else {
            return this.items.pop() || null;
        }
    }
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        else {
            return this.items[this.items.length - 1];
        }
    }
    isEmpty() {
        return this.items.length === 0;
    }
    count() {
        return this.items.length;
    }
}
