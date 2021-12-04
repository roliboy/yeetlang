export interface Symbol {
  value: string;
}

export const MARKER = {
  value: ".",
};

export const END = {
  value: "$",
};

export interface Production {
  id: number;
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
      id: 0,
      from: { value: `${grammar.startSymbol.value}'` },
      to: [MARKER, { value: grammar.startSymbol.value }],
    },
    ...grammar.productions.map(({ id, from, to }) => ({
      id: id + 1,
      from: from,
      to: [MARKER, ...to],
    })),
  ],
});
