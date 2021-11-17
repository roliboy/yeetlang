import { parse } from "https://deno.land/std/flags/mod.ts";
import { readFile } from "./util.ts";
import { Grammar } from "./grammar.ts";

const args = parse(Deno.args);

if (!args.i) {
  console.log("no input file provided");
  Deno.exit(1);
}

const input = await readFile(args.i);

const nonTerminals = input[0].split(",").map((x) => x.trim());
const terminals = input[1].split(",").map((x) => x.trim());
const startSymbol = input[2].trim();
const productions = input
  .slice(3)
  .map((x) => x.split(/->/).map((y) => y.trim()));

const fa = new Grammar({
  nonTerminals,
  terminals,
  startSymbol,
  productions,
});

let selection = "";
while (selection != "0") {
  console.log("0. exit");
  console.log("1. show non-terminals");
  console.log("2. show terminals");
  console.log("3. show productions");
  console.log("4. show productions for non-terminal");
  console.log("5. check context-free");

  selection = prompt("selection: ") || "";

  if (selection == "0") break;
  if (selection == "1") console.log(fa.getNonTerminals());
  if (selection == "2") console.log(fa.getTerminals());
  if (selection == "3") console.log(fa.getProductions());
  if (selection == "4")
    console.log(
      fa.getProductionsForNonTerminal(prompt("non-terminal: ") || "")
    );
  if (selection == "5") console.log(fa.checkContextFree());
}
