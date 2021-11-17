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


# lab 3

## requirements
- Statement: Implement a scanner (lexical analyzer): Implement the scanning algorithm and use ST from lab 2 for the symbol table.

- Input: Programs p1/p2/p3/p1err and token.in (see Lab 1a)

- Output: PIF.out, ST.out, message “lexically correct” or “lexical error + location”

- Deliverables: input, output, source code, documentation

## description

The input file is read line by line, then a regex is used to split each line into atoms. Using the `add` method of the InternalForm class, the atoms are added individually, in order, to the PIF.
The `add` method creates a tuple representing a token:
- if the atom is a reserved word, operator or separator: it is added directly with the index 0.
- otherwise, it tries to classify the atom as an identifier or a constant, and inserts it into the token list with the index received from the symbol table. If the atom could not be classified, an error is thrown.


## internal form
```typescript
import { SymbolTable } from "./symbol_table.ts";
import { isNumber, isString, isBoolean, isIdentifier } from "./regex.ts";

export enum TokenType {
  IDENTIFIER = "IDENTIFIER",
  NUMBER_CONSTANT = "NUMBER_CONSTANT",
  STRING_CONSTANT = "STRING_CONSTANT",
  BOOLEAN_CONSTANT = "BOOLEAN_CONSTANT",

  // TODO: enum constants for reserved keywords, operators and separators
}

export interface Token {
  type: string;
  index: number;
}

export class InternalForm {
  private reserved: Array<string>;
  private tokens: Array<Token>;
  private symbolTable: SymbolTable<number | string>;

  // store reserved words, create an array to store tokens and instantiate a symbol table
  constructor({ reserved }: { reserved: Array<string> }) {
    this.reserved = reserved;
    this.tokens = new Array<Token>();
    this.symbolTable = new SymbolTable<number | string>({ capacity: 32 });
  }

  // add the atom to the token list
  // if it is a reserved word / operator / separator, add it directly, with index 0
  // otherwise try to classify it as an identifier or a constant, and get the index from the symbol table
  add(atom: string) {
    const type = this.reserved.includes(atom) ? atom : this.classify(atom);
    const index = this.reserved.includes(atom) ? 0 : this.symbolTable.get(atom);
    this.tokens.push({ type, index });
  }

  // dump token list
  getTokens() {
    return this.tokens
      .map((token) => `(${token.type}, ${token.index})`)
      .join("\n");
  }

  // dump symbols
  getSymbols() {
    return this.symbolTable
      .getSymbols()
      .map((symbol, index) => (symbol ? `${index}: ${symbol}` : symbol))
      .filter((x) => x)
      .join("\n");
  }

  // classify given atom in one of the categories, or throw an error if it can't be classified
  private classify(atom: string): TokenType {
    if (isNumber(atom)) return TokenType.NUMBER_CONSTANT;
    if (isString(atom)) return TokenType.STRING_CONSTANT;
    if (isBoolean(atom)) return TokenType.BOOLEAN_CONSTANT;
    if (isIdentifier(atom)) return TokenType.IDENTIFIER;
    throw new Error("could not classify atom");
  }
}
```


## scanner
```typescript
import { parse } from "https://deno.land/std/flags/mod.ts";

import { InternalForm } from "./internal_form.ts";
import { readFile } from "./util.ts";
import { extractAtoms } from "./regex.ts";

const args = parse(Deno.args);

if (!args.i) {
  console.log("no input file provided");
  Deno.exit(1);
}

const reservedTokens = await readFile("token.in");
const internalForm = new InternalForm({ reserved: reservedTokens });
const input = await readFile(args.i);

input.forEach((line, lineNumber) => {
  extractAtoms(line).forEach((token) => {
    try {
      internalForm.add(token);
    } catch (error) {
      const { message } = error as Error;
      console.error(
        `lexical error: ${message}: '${token}' on line ${lineNumber}`
      );
      Deno.exit(2);
    }
  });
});

console.log("lexically correct");

await Deno.writeTextFile("./pif.out", internalForm.getTokens());
await Deno.writeTextFile("./st.out", internalForm.getSymbols());
```

## regular expressions

```typescript
export const extractAtoms = (sequence: string): Array<string> =>
  sequence.split(/('.*?')|[ ]|(?<=\w)(?=\W)|(?<=\W)(?=\w)/).filter((x) => x);

export const isNumber = (token: string): boolean =>
  /^[-]?[0-9]+(\.[0-9]+)?$/.test(token);

export const isString = (token: string): boolean => /^'[^']*'?$/.test(token);

export const isBoolean = (token: string): boolean =>
  /^(true|false)$/.test(token);

export const isConstant = (token: string): boolean =>
  isNumber(token) || isString(token) || isBoolean(token);

export const isIdentifier = (token: string): boolean =>
  /^[a-z][a-z0-9]*$/.test(token);
```

## pif.out

```plaintext
(decl, 0)
(IDENTIFIER, 31)
(number, 0)
(NUMBER_CONSTANT, 1)
(decl, 0)
(IDENTIFIER, 25)
((, 0)
(number, 0)
(), 0)
((, 0)
(NUMBER_CONSTANT, 16)
(,, 0)
(NUMBER_CONSTANT, 17)
(), 0)
(decl, 0)
(IDENTIFIER, 12)
(string, 0)
(STRING_CONSTANT, 10)
(decl, 0)
(IDENTIFIER, 24)
(number, 0)
(NUMBER_CONSTANT, 18)
(while, 0)
(<, 0)
(IDENTIFIER, 24)
(IDENTIFIER, 31)
(decl, 0)
(IDENTIFIER, 5)
(number, 0)
(@, 0)
(IDENTIFIER, 25)
(-, 0)
(IDENTIFIER, 24)
(NUMBER_CONSTANT, 18)
(decl, 0)
(IDENTIFIER, 6)
(number, 0)
(@, 0)
(IDENTIFIER, 25)
(-, 0)
(IDENTIFIER, 24)
(NUMBER_CONSTANT, 17)
(set, 0)
(@, 0)
(IDENTIFIER, 25)
(IDENTIFIER, 24)
(+, 0)
(IDENTIFIER, 5)
(IDENTIFIER, 6)
(set, 0)
(IDENTIFIER, 24)
(+, 0)
(IDENTIFIER, 24)
(NUMBER_CONSTANT, 17)
(end, 0)
(set, 0)
(IDENTIFIER, 24)
(NUMBER_CONSTANT, 16)
(while, 0)
(<, 0)
(IDENTIFIER, 24)
(IDENTIFIER, 31)
(->, 0)
(@, 0)
(IDENTIFIER, 25)
(IDENTIFIER, 24)
(set, 0)
(IDENTIFIER, 24)
(+, 0)
(IDENTIFIER, 24)
(NUMBER_CONSTANT, 17)
(end, 0)
```

## st.out
```plaintext
1: 10
5: t1
6: t2
10: 'hello world'
12: dummy
16: 0
17: 1
18: 2
24: index
25: sequence
31: limit
```