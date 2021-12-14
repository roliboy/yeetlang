import { CanonicalCollection, closureEquals } from "./canonical_collection.ts";
import { getProductionClosure, Closure } from "./closure.ts";
import { getNextSymbol } from "./closure.ts";
import { Symbol, Production, Grammar, END } from "./grammar.ts";
import { goto } from "./goto.ts";

export interface ParsingTable {
  entries: Array<ParsingTableEntry>;
}

export enum ParsingTableActionType {
  SHIFT,
  REDUCE,
  ACCEPT,
}

export interface ParsingTableAction {
  type: ParsingTableActionType;
  value?: number;
}

export interface ParsingTableEntry {
  state: number;
  closure: Closure;
  action: ParsingTableAction;
  goto: Map<String, number>;
}

export const createParsingTable = (
  canonicalCollection: CanonicalCollection,
  grammar: Grammar
): ParsingTable => {
  const entries = Array<ParsingTableEntry>();
  canonicalCollection.closures.forEach((closure, index) => {
    const gotoActions = new Map<String, number>();
    let action = {} as ParsingTableAction;
    closure.productions.forEach((production) => {
      const nextSymbol = getNextSymbol(production);
      if (nextSymbol.value == END.value) {
        if (production.id == 0) {
          action = {
            type: ParsingTableActionType.ACCEPT,
          };
        } else {
          action = {
            type: ParsingTableActionType.REDUCE,
            value: production.id,
          };
        }
      } else {
        const nextClosure = goto(
          { productions: [production] },
          nextSymbol,
          grammar
        );
        const closureIndex = findClosureIndexInCanonicalCollection(
          canonicalCollection,
          nextClosure
        );
        gotoActions.set(nextSymbol.value, closureIndex);
        action = {
          type: ParsingTableActionType.SHIFT,
        };
      }
    });

    entries.push({
      state: index,
      closure: closure,
      action: action,
      goto: gotoActions,
    });
  });
  return { entries };
};

const findClosureIndexInCanonicalCollection = (
  canonicalCollection: CanonicalCollection,
  closure: Closure
) =>
  canonicalCollection.closures.findIndex((canonicalCollectionClosure) =>
    closureEquals(canonicalCollectionClosure, closure)
  );
