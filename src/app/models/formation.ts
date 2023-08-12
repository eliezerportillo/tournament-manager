export class Formation extends Array<number> {
    constructor(...values: number[]) {
        super(...values);
    }

    get count(): number {
        return this.reduce((total, currentValue) => total + currentValue, 0);
    }

    get name(): string {
        return this.join('-');
    }
}