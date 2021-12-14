import { Grammar, Production } from "./grammar.ts";
import {
  getProductionsForNonTerminal,
  getProductionClosure,
  Closure,
} from "./closure.ts";
import { goto } from "./goto.ts";

export interface CanonicalCollection {
  closures: Array<Closure>;
}

export const toCanonicalCollection = (
  grammar: Grammar
): CanonicalCollection => {
  const canonicalCollection: Array<Closure> = [];

  const start = getProductionsForNonTerminal(grammar, grammar.startSymbol);
  const processing = [start];

  while (processing.length > 0) {
    const productions = processing.pop()!;
    const closure = getProductionClosure(productions, grammar);

    if (
      !closureIsEmpty(closure) &&
      !containsClosure(canonicalCollection, closure)
    ) {
      canonicalCollection.push(closure);
      for (const symbol of [...grammar.nonTerminals, ...grammar.terminals]) {
        processing.push(goto(closure, symbol, grammar).productions);
      }
    }
  }

  return {
    closures: canonicalCollection.map((closure) =>
      removeDuplicatesFromClosure(closure)
    ),
  };
};

const closureIsEmpty = (closure: Closure) => closure.productions.length == 0;

export const closureEquals = (first: Closure, second: Closure) =>
  first.productions.every((production) =>
    closureContainsProduction(second, production)
  ) &&
  second.productions.every((production) =>
    closureContainsProduction(first, production)
  );

const closureContainsProduction = (closure: Closure, production: Production) =>
  closure.productions.some((closureProduction) =>
    productionEquals(closureProduction, production)
  );

export const productionEquals = (first: Production, second: Production) => {
  if (first.from.value != second.from.value) return false;
  if (first.to.length != second.to.length) return false;
  return Array(first.to.length)
    .fill(false)
    .map((_, index) => first.to[index].value == second.to[index].value)
    .every((equals) => equals == true);
};

const containsClosure = (
  canonicalCollection: Array<Closure>,
  closure: Closure
) =>
  canonicalCollection.some((collectionClosure) =>
    closureEquals(collectionClosure, closure)
  );

export const removeDuplicatesFromClosure = (closure: Closure): Closure => ({
  ...closure,
  productions: closure.productions.filter(
    (production, index, self) =>
      index === self.findIndex((p) => productionEquals(p, production))
  ),
});
