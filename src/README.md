# lab 2

for this laboratory i chose to implement the ST as a hash table.

## design

it has a single public method `get`, which is used to insert and find elements:
- on insert, the element is placed in the cell corresponding to the value of the element's hash. if the position is already taken, the element is inserted in the next empty cell.
- on lookup, similarly to insert, the hash of the element is computed, and the index is returned if the element was found on the given position. if the element is not in the cell indicated by the hash function, a sequential search is started from that position, and the index on which the searched element was found is returned.

if the hash table's capacity is exceeded, an error will be thrown.

currently, the table uses two hash functions:
- for strings: the sum of ascii values of all characters, modulo capacity
- for numbers: the closest integer part of the number is taken, modulo capacity
- everything else: constant 0 is returned

## implementation

the hash table was implemented in typescript, and is a generic class, accepting any type of value

```typescript
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
}
```

tests:

```typescript
import { SymbolTable } from "./main.ts";

const testOnLookupReturnsPositionIfElementAlreadyExists = () => {
  console.log(
    "running test: on lookup returns position if element already exists"
  );

  const symbolTable = new SymbolTable<string | number>({ capacity: 10 });

  const initialValueIndex = symbolTable.get("abc");
  console.log(`initial value 'abc', index: ${initialValueIndex}`);

  const lookupValueIndex = symbolTable.get("abc");
  console.log(`lookup value 'abc', index: ${lookupValueIndex}`);

  if (lookupValueIndex != initialValueIndex) {
    console.error("returned indices do not match");
  }

  symbolTable.draw();
};

const testOnCollisionElementIsPlacedInNextEmptyCell = () => {
  console.log(
    "running test: on collision element is placed in next empty cell"
  );

  const symbolTable = new SymbolTable<string | number>({ capacity: 10 });

  const firstValueIndex = symbolTable.get(2);
  console.log(`inserted value 2, index: ${firstValueIndex}`);

  const secondValueIndex = symbolTable.get(12);
  console.log(`inserted value 12, index: ${secondValueIndex}`);

  if (secondValueIndex != firstValueIndex + 1) {
    console.error("element was not placed on first empty cell");
  }

  symbolTable.draw();
};

const testOnCapacityFullThrowsError = () => {
  console.log("running test: on capacity full throws error");

  const symbolTable = new SymbolTable<string | number>({ capacity: 4 });

  const firstValueIndex = symbolTable.get("lorem");
  console.log(`inserted value 'lorem', index: ${firstValueIndex}`);

  const secondValueIndex = symbolTable.get("ipsum");
  console.log(`inserted value 'ipsum', index: ${secondValueIndex}`);

  const thirdValueIndex = symbolTable.get("dolor");
  console.log(`inserted value 'dolor', index: ${thirdValueIndex}`);

  const fourthValueIndex = symbolTable.get("sit");
  console.log(`inserted value 'sit', index: ${fourthValueIndex}`);

  try {
    const fifthValueIndex = symbolTable.get("amet");
    console.log(`inserted value 'sit', index: ${fifthValueIndex}`);
  } catch (_) {
    console.log("symbol table is full");
  }

  symbolTable.draw();
};

testOnLookupReturnsPositionIfElementAlreadyExists();
testOnCollisionElementIsPlacedInNextEmptyCell();
testOnCapacityFullThrowsError();
```