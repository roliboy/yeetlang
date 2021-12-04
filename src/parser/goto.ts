import { Closure, getNextSymbol, getProductionClosure } from "./closure.ts";
import { Grammar, Production, Symbol, MARKER } from "./grammar.ts";

export const goto = (closure: Closure, symbol: Symbol, grammar: Grammar) => {
  return getProductionClosure(advance(closure, symbol), grammar);
};

export const advance = (closure: Closure, symbol: Symbol) => {
  return closure.productions
    .filter((production) => symbol.value == getNextSymbol(production).value)
    .map((production) => moveMarker(production));
};

export const moveMarker = (production: Production) => {
  const symbols = [...production.to];
  const index = symbols.findIndex((symbol) => symbol.value == MARKER.value);
  // if (index < symbols.length) {
  symbols[index] = symbols[index + 1];
  symbols[index + 1] = MARKER;
  // }
  return {
    ...production,
    to: symbols,
  };
};
