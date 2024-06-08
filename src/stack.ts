class Stack<T extends number | string | boolean> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    public push(item: T): void {
        this.items.push(item);
    }

    public pop(): T | null {
        if (this.isEmpty()) {
            return null;
        } else {
            return this.items.pop() || null;
        }
    }
    
    public peek(): T | null {
        if (this.isEmpty()) {
            return null;
        } else {
            return this.items[this.items.length - 1];
        }
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public count(): number {
        return this.items.length;
    }
}