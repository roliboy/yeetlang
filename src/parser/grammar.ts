export interface Symbol {
  value: string;
}

export interface Production {
  id: number;
  closure: number;
  from: Symbol;
  to: Array<Symbol>;
}

export interface Grammar {
  nonTerminals: Array<Symbol>;
  terminals: Array<Symbol>;
  startSymbol: Symbol;
  productions: Array<Production>;
}

/// Parse grammar from raw input
export const grammarFromRaw = ({
  nonTerminals,
  terminals,
  startSymbol,
  productions,
}: {
  nonTerminals: string;
  terminals: string;
  startSymbol: string;
  productions: Array<string>;
}): Grammar => ({
  nonTerminals: nonTerminals
    .split(",")
    .map((x) => x.trim())
    .map((value) => ({ value })),
  terminals: terminals
    .split(",")
    .map((x) => x.trim())
    .map((value) => ({ value })),
  startSymbol: { value: startSymbol.trim() },
  productions: productions
    .map((x) => x.split(/->/).map((y) => y.trim()))
    .reduce((r, e) => {
      e[1].split("|").forEach((k) => r.push([e[0], k.trim()]));
      return r;
    }, Array<Array<string>>())
    .map((production, index) => ({
      closure: 0,
      id: index,
      from: { value: production[0] },
      to: production[1].split(" ").map((x) => ({ value: x })),
    })),
});

/// Append extra production to grammar and set new starting symbol
export const createAugmentedGrammar = (grammar: Grammar): Grammar => ({
  nonTerminals: [
    { value: `${grammar.startSymbol.value}'` },
    ...grammar.nonTerminals,
  ],
  terminals: [...grammar.terminals],
  startSymbol: { value: `${grammar.startSymbol.value}'` },
  productions: [
    {
      closure: 0,
      id: 0,
      from: { value: `${grammar.startSymbol.value}'` },
      to: [{ value: "." }, { value: grammar.startSymbol.value }],
    },
    ...grammar.productions.map(({ id, from, to }) => ({
      closure: 0,
      id: id + 1,
      from: from,
      to: [{ value: "." }, ...to],
    })),
  ],
});

export const getNonTerminalsToString = (grammar: Grammar) =>
  grammar.nonTerminals.map((x) => x.value).join(", ");

export const getTerminalsToString = (grammar: Grammar) =>
  grammar.terminals.map((x) => x.value).join(", ");

export const getStartSymbolToString = (grammar: Grammar) =>
  grammar.startSymbol.value;

export const getProductionsToString = (grammar: Grammar) =>
  grammar.productions
    .map(
      (production) =>
        `${production.id}: \t${production.from.value} -> ${production.to
          .map((x) => x.value)
          .join(" ")}`
    )
    .join("\n");

export const getProductionsForNonTerminalToString = (
  grammar: Grammar,
  nonTerminal: string
) =>
  grammar.productions
    .filter((production) => production.from.value == nonTerminal)
    .map(
      (production) =>
        `${production.id}: \t${production.from.value} -> ${production.to
          .map((x) => x.value)
          .join(" ")}`
    )
    .join("\n");

export const checkContextFree = (grammar: Grammar) =>
  grammar.productions.every((production) =>
    grammar.nonTerminals.some(
      (nonTerminal) => nonTerminal.value == production.from.value
    )
  );

export const getProductionsForNonTerminal = (
  grammar: Grammar,
  symbol: Symbol
) =>
  grammar.productions.filter(
    (production) => production.from.value == symbol.value
  );
