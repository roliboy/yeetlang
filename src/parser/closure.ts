import { Grammar, Production, Symbol, MARKER, END } from "./grammar.ts";

export interface Closure {
  productions: Array<Production>;
}

/// Generates the closure for a given production
export const getProductionClosure = (
  productions: Array<Production>,
  grammar: Grammar
) => {
  const processing: Array<Production> = [...productions];
  const processed: Array<Symbol> = [];
  const closure: Array<Production> = [];

  while (processing.length > 0) {
    const current = processing.shift()!;
    closure.push(current);
    const next = getNextSymbol(current);
    if (
      next &&
      isNonTerminal(next, grammar) &&
      !includesSymbol(processed, next)
    ) {
      processing.push(...getProductionsForNonTerminal(grammar, next));
      processed.push(next);
    }
  }

  return { productions: closure };
};

export const getNextSymbol = (production: Production) => {
  const index = production.to.findIndex(
    (symbol) => symbol.value == MARKER.value
  );
  return index < production.to.length - 1 ? production.to[index + 1] : END;
};

export const isNonTerminal = (symbol: Symbol, grammar: Grammar) =>
  grammar.nonTerminals.some(
    (grammarSymbol) => grammarSymbol.value == symbol.value
  );

export const includesSymbol = (symbols: Array<Symbol>, symbol: Symbol) =>
  symbols.some((s) => s.value == symbol.value);

export const getProductionsForNonTerminal = (
  grammar: Grammar,
  symbol: Symbol
) =>
  grammar.productions.filter(
    (production) => production.from.value == symbol.value
  );
