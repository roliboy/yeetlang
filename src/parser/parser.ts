import {
  ParsingTable,
  ParsingTableEntry,
  ParsingTableActionType,
} from "./parsing_table.ts";
import { Grammar, Symbol, Production, MARKER } from "./grammar.ts";

export enum ParserElementType {
  SYMBOL,
  STATE,
}

export interface ParserElement {
  type: ParserElementType;
  value: Symbol | number;
}

export const parseSequence = (
  parsingTable: ParsingTable,
  grammar: Grammar,
  sequence: string
) => {
  const alpha = [
    {
      type: ParserElementType.SYMBOL,
      value: {
        value: "$",
      },
    },
    {
      type: ParserElementType.STATE,
      value: 0,
    },
  ];
  const beta = [
    ...sequence.split("").map((char) => ({
      type: ParserElementType.SYMBOL,
      value: {
        value: char,
      },
    })),
    {
      type: ParserElementType.SYMBOL,
      value: {
        value: "$",
      },
    },
  ];
  const pi = new Array<number>();

  while (true) {
    // console.log(
    //   "alpha before: \n" +
    //     alpha.map((x) => `  ${x.type}  ${JSON.stringify(x.value)}`).join("\n")
    // );
    // console.log(
    //   "beta before: \n" +
    //     beta.map((x) => `  ${x.type}  ${JSON.stringify(x.value)}`).join("\n")
    // );

    const currentAction = action(parsingTable, alpha);

    if (currentAction.type == ParsingTableActionType.SHIFT) {
      const gotoState = gotoStates(parsingTable, alpha, beta)!;

      // console.log("GOTO STATE:", gotoState);

      const nextSymbol = beta.shift()!;
      alpha.push(nextSymbol);
      alpha.push({
        type: ParserElementType.STATE,
        value: gotoState,
      });
    } else if (currentAction.type == ParsingTableActionType.REDUCE) {
      // console.log("reduce " + currentAction.value);
      pi.push(currentAction.value!);

      const production = getProduction(grammar, currentAction.value!);
      production.to.forEach((symbol) => {
        alpha.pop();
        alpha.pop();
      });

      const nextState = goto(parsingTable, alpha[alpha.length - 1], {
        type: ParserElementType.SYMBOL,
        value: production.from,
      });

      alpha.push({
        type: ParserElementType.SYMBOL,
        value: production.from,
      });
      alpha.push({
        type: ParserElementType.STATE,
        value: nextState,
      });
    } else if (currentAction.type == ParsingTableActionType.ACCEPT) {
      // console.log("accept");
      // console.log(pi);
      return pi;
      // break;
    }

    // console.log(
    //   "alpha after: \n" +
    //     alpha.map((x) => `  ${x.type}  ${JSON.stringify(x.value)}`).join("\n")
    // );
    // console.log(
    //   "beta after: \n" +
    //     beta.map((x) => `  ${x.type}  ${JSON.stringify(x.value)}`).join("\n")
    // );

    // console.log("");
    // console.log("");
  }
};

const getProduction = (grammar: Grammar, id: number): Production => {
  const production = grammar.productions.find((prod) => prod.id == id)!;
  return {
    id: production.id,
    from: production.from,
    to: production.to.filter((symbol) => symbol.value != MARKER.value),
  };
};

const action = (parsingTable: ParsingTable, alpha: Array<ParserElement>) => {
  return findState(parsingTable, alpha[alpha.length - 1]).action;
};

const gotoStates = (
  parsingTable: ParsingTable,
  alpha: Array<ParserElement>,
  beta: Array<ParserElement>
) => {
  const currentState = findState(parsingTable, alpha[alpha.length - 1]);
  const nextElement = beta[0];
  // console.log(nextElement.value);
  // console.log([...currentState.goto.entries()]);
  return currentState.goto.get((nextElement.value as Symbol).value);
};

const goto = (
  parsingTable: ParsingTable,
  state: ParserElement,
  symbol: ParserElement
) => {
  const currentState = findState(parsingTable, state);
  // const nextElement = beta[0];
  // console.log(nextElement.value);
  // console.log([...currentState.goto.entries()]);
  return currentState.goto.get((symbol.value as Symbol).value)!;
};

const findState = (
  parsingTable: ParsingTable,
  currentElement: ParserElement
): ParsingTableEntry => {
  if (currentElement.type != ParserElementType.STATE) {
    console.error("");
  }
  return parsingTable.entries.find(
    (entry) => entry.state == currentElement.value
  )!;
};
