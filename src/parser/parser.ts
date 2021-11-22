import { Item } from "./parsing_table.ts";
import { Grammar, Production } from "./grammar.ts";

/// Parse a sequence using the parsing table
export const parseSequence = (
  input: string,
  parsingTable: Array<Item>,
  grammar: Grammar
) => {
  const sequence = input + "$";
  let pointer = 0;

  const stack = ["0", sequence[pointer]];
  const productions: Array<Production> = [];

  while (true) {
    const currentStateIndex = stack[stack.length - 2];
    const currentSymbol = stack[stack.length - 1];
    const state = getState(parsingTable, parseInt(currentStateIndex)!);

    const action = getAction(currentSymbol, state);

    if (action.type == "shift") {
      stack.push(action.argument!.toString());
      pointer += 1;
      stack.push(sequence[pointer]);
    }

    if (action.type == "reduce") {
      stack.pop();
      const production = grammar.productions.find(
        (production) => production.id == action.argument!
      )!;

      productions.push({
        ...production,
        to: production.to.filter((symbol) => symbol.value != "."),
      });

      production.to.forEach((symbol) => {
        if (symbol.value != ".") {
          stack.pop();
          stack.pop();
        }
      });
      stack.push(production.from.value);
    }

    if (action.type == "goto") {
      stack.push(action.argument!.toString());
      stack.push(sequence[pointer]);
    }

    if (action.type == "accept") {
      console.info("sequence accepted");
      break;
    }

    if (action.type == "error") {
      console.error("failed to parse sequence");
      break;
    }
  }

  return productions;
};

/// Get state with given id
export const getState = (parsingTable: Array<Item>, state: number) => {
  return parsingTable.find((item) => item.state == state)!;
};

/// Get an action for a given state and symbol
export const getAction = (symbol: string, state: Item) => {
  const action = state.actions.get(symbol);
  if (action) {
    if (action!.type == "reduce" && action.argument == 0 && symbol == "$") {
      return { type: "accept" };
    } else {
      return {
        type: action!.type,
        argument: action!.argument,
      };
    }
  }
  if (state.goto.get(symbol)) {
    return { type: "goto", argument: state.goto.get(symbol) };
  }
  return { type: "error" };
};
