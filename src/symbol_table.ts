export class SymbolTable<T> {
  private capacity: number;
  private elements: Array<T>;

  // create an empty array with `capacity` elements of `undefined`
  constructor({ capacity }: { capacity: number }) {
    this.capacity = capacity;
    this.elements = new Array<T>(capacity);
  }

  // iterate `capacity` times, starting from the hash code of `value`,
  // if the searched element is found, return the index,
  // if an empty position is found, insert the value and return the index.
  // if the loop completes without returning, raise an error because the symbol table is full.
  get(value: T) {
    for (let start = this.h(value), i = start; i < start + this.capacity; i++) {
      const index = i % this.capacity;

      switch (this.elements[index]) {
        case value:
          return index;
        case undefined:
          this.elements[index] = value;
          return index;
      }
    }
    throw new Error("symbol table is full");
  }

  // generic hash function with different behavior for each supported type,
  // on unsupported types it returns constant 0.
  private h(value: T) {
    switch (typeof value) {
      // sum up ascii codes and take modulo capacity
      case "string":
        return (
          [...value].map((c) => c.charCodeAt(0)).reduce((a, c) => a + c) %
          this.capacity
        );
      // round the number and take modulo capacity
      case "number":
        return Math.round(value) % this.capacity;
      default:
        return 0;
    }
  }

  // return list of symbols
  getSymbols() {
    return [...this.elements];
  }
}
