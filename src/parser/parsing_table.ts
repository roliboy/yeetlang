import {
  Closure,
  findNext,
  productionEquals,
  advance,
} from "./canonical_collection.ts";

import { Grammar, Production, Symbol } from "./grammar.ts";

export interface Action {
  type: string;
  argument: number;
}

export interface Item {
  state: number;
  actions: Map<string, Action>;
  goto: Map<string, number>;
}

/// Create the parsing table of a canonical collection
export const collectionToParsingTable = (
  collection: Array<Closure>,
  grammar: Grammar
) => {
  const parsingTable: Array<Item> = [];

  collection.forEach((closure) => {
    const actions: Map<string, Action> = new Map();
    const goto: Map<string, number> = new Map();

    closure.productions.forEach((production) => {
      const next = findNext(production.to) || { value: "$" };

      if (grammar.nonTerminals.some((symbol) => symbol.value == next.value)) {
        const closureId = getClosureForNextProduction(
          production,
          next,
          collection
        )!.id;
        if (goto.has(next.value)) {
          console.log("goto conflict " + next.value);
        }
        goto.set(next.value, closureId);
      }
      if (grammar.terminals.some((symbol) => symbol.value == next.value)) {
        const closureId = getClosureForNextProduction(
          production,
          next,
          collection
        )!.id;
        if (actions.has(next.value)) {
          console.log("shift conflict " + next.value);
        }
        actions.set(next.value, { type: "shift", argument: closureId });
      }
      if (next.value == "$") {
        [next, ...grammar.terminals].forEach((terminal) => {
          if (actions.has(terminal.value)) {
            console.log("reduce conflict " + terminal.value);
          }
          actions.set(terminal.value, {
            type: "reduce",
            argument: production.id,
          });
        });
      }
    });

    parsingTable.push({
      state: closure.id,
      actions: actions,
      goto: goto,
    });
  });

  return parsingTable;
};

/// Generate closure for the production after moving the '.' marker
export const getClosureForNextProduction = (
  production: Production,
  next: Symbol,
  closures: Array<Closure>
) => {
  production = {
    ...production,
    to: advance(production.to),
  };

  const candidates = closures.filter(
    (closure) => closure.symbol.value == next.value
  );

  for (const closure of candidates) {
    for (const p of closure.productions) {
      if (productionEquals(p, production)) {
        return closure;
      }
    }
  }
};

export const parsingTableToString = (parsingTable: Array<Item>) => {
  let r = "";
  parsingTable.forEach((item) => {
    r += `${item.state}\n`;

    r += `\tactions: \n`;
    item.actions.forEach((value, key) => {
      r += `\t\t${key} => ${value.type} ${value.argument}\n`;
    });

    r += `\tgoto: \n`;
    item.goto.forEach((value, key) => {
      r += `\t\t${key} => ${value}\n`;
    });

    r += `\n`;
  });
  return r;
};
