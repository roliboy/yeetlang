import {
  Grammar,
  Production,
  getProductionsForNonTerminal,
} from "./grammar.ts";
import { Symbol } from "./grammar.ts";

export interface Closure {
  id: number;
  symbol: Symbol;
  productions: Array<Production>;
}

/// Creates the LR(0) canonical collection of a given grammar
export const toCanonicalCollection = (grammar: Grammar) => {
  const initialProduction = grammar.productions.find(
    (production) => production.from.value == grammar.startSymbol.value
  )!;

  const pendingProductionSets = [
    { symbol: "START", productions: [initialProduction] },
  ];
  const canonicalCollection: Array<Closure> = [];

  while (pendingProductionSets.length > 0) {
    const current = pendingProductionSets.shift()!;

    const closure = {
      id: canonicalCollection.length,
      symbol: { value: current.symbol },
      productions: getProductionClosure(current.productions, grammar),
    };

    if (containsClosure(canonicalCollection, closure)) continue;
    canonicalCollection.push(annotateClosureProductions(closure));

    const productionMap = new Map<string, Array<Production>>();
    closure.productions.forEach((production) => {
      if (!isFinal(production.to)) {
        const nextSymbol = findNext(production.to);
        const nextProduction = { ...production, to: advance(production.to) };
        if (!productionMap.has(nextSymbol.value)) {
          productionMap.set(nextSymbol.value, []);
        }
        productionMap.set(nextSymbol.value, [
          ...productionMap.get(nextSymbol.value)!,
          nextProduction,
        ]);
      }
    });
    productionMap.forEach((productions, symbol) => {
      pendingProductionSets.push({ symbol, productions });
    });
  }

  return canonicalCollection;
};

/// Generates the closure for a given production
export const getProductionClosure = (
  productions: Array<Production>,
  grammar: Grammar
) => {
  const processing: Array<Production> = [...productions];
  const processed: Array<string> = [];
  const closure: Array<Production> = [];

  while (processing.length > 0) {
    const current = processing.shift()!;
    closure.push(current);
    const next = findNext(current.to);
    if (
      next &&
      grammar.nonTerminals.map((x) => x.value).includes(next.value) &&
      !processed.includes(next.value)
    ) {
      processing.push(...getProductionsForNonTerminal(grammar, next));
      processed.push(next.value);
    }
  }

  return closure;
};

/// Sets the closure property of every production to the id of the closure
export const annotateClosureProductions = (closure: Closure) => {
  return {
    ...closure,
    productions: closure.productions.map((production) => ({
      ...production,
      closure: closure.id,
    })),
  };
};

/// Check if a closure is contained in a set of closures
export const containsClosure = (closures: Array<Closure>, closure: Closure) => {
  return closures.some((c) => closureEquals(c, closure));
};

/// Check if two closures are equal
export const closureEquals = (first: Closure, second: Closure) => {
  if (first.productions.length != second.productions.length) return false;
  return Array(first.productions.length)
    .fill(false)
    .map((_, index) =>
      productionEquals(first.productions[index], second.productions[index])
    )
    .every((equals) => equals == true);
};

/// Check if two productions are equal
export const productionEquals = (first: Production, second: Production) => {
  if (first.from.value != second.from.value) return false;
  if (first.to.length != second.to.length) return false;
  return Array(first.to.length)
    .fill(false)
    .map((_, index) => first.to[index].value == second.to[index].value)
    .every((equals) => equals == true);
};

/// Check if a production result is final
export const isFinal = (symbols: Array<Symbol>) => {
  return symbols[symbols.length - 1].value == ".";
};

/// Get the next symbol after the '.' marker
export const findNext = (symbols: Array<Symbol>) => {
  const index = symbols.findIndex((symbol) => symbol.value == ".");
  return symbols[index + 1];
};

/// Move the '.' marker one place to the right
export const advance = (symbols: Array<Symbol>) => {
  const newSymbols = [...symbols];
  const index = newSymbols.findIndex((symbol) => symbol.value == ".");
  newSymbols[index] = newSymbols[index + 1];
  newSymbols[index + 1] = { value: "." };
  return newSymbols;
};

export const productionToString = (production: Production) => {
  return `${production.from.value} -> ${production.to
    .map((symbol) => symbol.value)
    .join(" ")}`;
};
export const closureToString = (closure: Closure) => {
  return `closure ${closure.id}:\n${closure.productions
    .map((p) => productionToString(p))
    .join("\n")}\n`;
};

export const canonicalCollectionToString = (collection: Array<Closure>) => {
  let r = ``;
  collection.forEach((closure) => {
    r += `${closure.id}:\n`;
    closure.productions.forEach((production) => {
      r += `    ${production.from.value} -> ${production.to
        .map((x) => x.value)
        .join(" ")}`;
      r += "\n";
    });
    r += "\n";
  });
  return r;
};
