class Production {
  from: string;
  to: string;
  constructor({ from, to }: { from: string; to: string }) {
    this.from = from;
    this.to = to;
  }
}

export class Grammar {
  private nonTerminals: Array<string>;
  private terminals: Array<string>;
  private startSymbol: string;
  private productions: Array<Production>;

  constructor({
    nonTerminals,
    terminals,
    startSymbol,
    productions,
  }: {
    nonTerminals: Array<string>;
    terminals: Array<string>;
    startSymbol: string;
    productions: Array<Array<string>>;
  }) {
    this.nonTerminals = nonTerminals;
    this.terminals = terminals;
    this.startSymbol = startSymbol;
    this.productions = productions.map(
      (production) => new Production({ from: production[0], to: production[1] })
    );
  }

  getNonTerminals() {
    return this.nonTerminals.join(", ");
  }

  getTerminals() {
    return this.terminals.join(", ");
  }

  getStartSymbol() {
    return this.startSymbol;
  }

  getProductions() {
    return this.productions
      .map((production) => `${production.from} -> ${production.to}`)
      .join("\n");
  }

  getProductionsForNonTerminal(nonTerminal: string) {
    return this.productions
      .filter((production) => production.from == nonTerminal)
      .map((production) => `${production.from} -> ${production.to}`)
      .join("\n");
  }

  checkContextFree() {
    return this.productions.every((production) =>
      this.nonTerminals.includes(production.from)
    );
  }
}
