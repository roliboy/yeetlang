import { parse } from "https://deno.land/std/flags/mod.ts";

import { readFile } from "./util.ts";

import { FiniteAutomata } from "./finite_automata.ts";

const args = parse(Deno.args);

if (!args.i) {
  console.log("no input file provided");
  Deno.exit(1);
}

const input = await readFile(args.i);

const states = input[0].split(",").map((x) => x.trim());
const alphabet = input[1].split(",").map((x) => x.trim());
const initialState = input[2].trim();
const finalStates = input[3].split(",").map((x) => x.trim());
const transitions = input
  .slice(4)
  .map((x) => x.split(/,|->/).map((y) => y.trim()));

const fa = new FiniteAutomata({
  states,
  alphabet,
  initialState,
  finalStates,
  transitions,
});

let selection = "";
while (selection != "0") {
  console.log("0. exit");
  console.log("1. show states");
  console.log("2. show alphabet");
  console.log("3. show initial state");
  console.log("4. show final states");
  console.log("5. show transitions");
  console.log("6. check sequence");

  selection = prompt("selection: ") || "";

  if (selection == "0") break;
  if (selection == "1") console.log(fa.getStates());
  if (selection == "2") console.log(fa.getAlphabet());
  if (selection == "3") console.log(fa.getInitialState());
  if (selection == "4") console.log(fa.getFinalStates());
  if (selection == "5") console.log(fa.getTransitions());
  if (selection == "6") {
    const sequence = prompt("sequence: ") || "";
    console.log(fa.verifiy(sequence));
  }
}
