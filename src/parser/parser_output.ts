import { Grammar, Production, Symbol, MARKER } from "./grammar.ts";

export const reconstructParserOutput = (
  _derivations: Array<number>,
  grammar: Grammar
) => {
  const snapshots: Array<Array<Symbol>> = [[grammar.startSymbol]];
  const derivations = [..._derivations, 0]
    .reverse()
    .map((index) => removeMarker(getProduction(grammar, index)));

  derivations.forEach((production) => {
    const current = snapshots[snapshots.length - 1];
    snapshots.push(expand(current, production));
  });

  return snapshots;
};

const expand = (current: Array<Symbol>, production: Production) => {
  const symbolIndex = current.findIndex(
    (symbol) => symbol.value == production.from.value
  );
  const next = [...current];
  next.splice(symbolIndex, 1, ...production.to);
  return next;
};

const getProduction = (grammar: Grammar, id: number) =>
  grammar.productions.find((prod) => prod.id == id)!;

const removeMarker = (production: Production) => ({
  id: production.id,
  from: production.from,
  to: production.to.filter((symbol) => symbol.value != MARKER.value),
});
