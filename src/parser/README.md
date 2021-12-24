# Final lab parsing (integrate Lab 5, Lab 6, Lab 7)

[https://github.com/roliboy/yeetlang](https://github.com/roliboy/yeetlang)

## Team
- Catalin Pap
- Roland Nagy

## Steps

The algorithm consists of six main steps / function calls:
- `grammarFromRaw`: parses a grammar definition from a file
- `createAugmentedGrammar`: creates the augmented grammar
- `toCanonicalCollection`: computes the canonical collection of the grammar
- `createParsingTable`: creates the parsing table based on the canonical collection
- `parseSequence`: parses a given sequence and returns the list of productions that need to be applied to get to the sequence from the starting symbol
- `reconstructParserOutput`: applies the derivations to obtain the sequence starting from the start symbol

## Data structures

### Grammar

The grammar is defined by the list of terminal and non-terminal symbols, the starting symbol and a list of productions.

```ts
interface Grammar {
  nonTerminals: Array<Symbol>;
  terminals: Array<Symbol>;
  startSymbol: Symbol;
  productions: Array<Production>;
}

interface Production {
  id: number;
  from: Symbol;
  to: Array<Symbol>;
}

interface Symbol {
  value: string;
}
```

### Canonical collection

The canonical collection is represented as a list of closures. A closure is a list of productions.

```ts
interface CanonicalCollection {
  closures: Array<Closure>;
}
interface Closure {
  productions: Array<Production>;
}
```

### Parsing table

The parsing table is a list of `ParsingTableEntry` objects. One entry corresponds to a row in the parsing table. The `state` property is the index of the closure, `action` is one of 'SHIFT', 'REDUCE' and 'ACCEPT'. Finally, `goto` is the goto part of the table, represented as a map from a symbol value to a state index.

```ts
interface ParsingTable {
  entries: Array<ParsingTableEntry>;
}

interface ParsingTableEntry {
  state: number;
  action: ParsingTableAction;
  goto: Map<String, number>;
}

interface ParsingTableAction {
  type: ParsingTableActionType;
  value?: number;
}

enum ParsingTableActionType {
  SHIFT,
  REDUCE,
  ACCEPT,
}
```

### Parser

The elements in the alpha and beta stacks are represented as tuples of type and value

```ts
interface ParserElement {
  type: ParserElementType;
  value: Symbol | number;
}

enum ParserElementType {
  SYMBOL,
  STATE,
}
```
