import { parse } from "https://deno.land/std/flags/mod.ts";
import { readFile } from "./util.ts";
import { grammarFromRaw, createAugmentedGrammar } from "./grammar.ts";
import { toCanonicalCollection } from "./canonical_collection.ts";
import { collectionToParsingTable } from "./parsing_table.ts";
import { parseSequence } from "./parser.ts";
import {
  toDerivationsString,
  derivationsToString,
} from "./derivations_string.ts";

const args = parse(Deno.args);

if (!args.i) {
  console.log("no input file provided");
  Deno.exit(1);
}

const input = await readFile(args.i);

const nonTerminals = input[0];
const terminals = input[1];
const startSymbol = input[2];
const productions = input.slice(3);

const grammar = grammarFromRaw({
  nonTerminals,
  terminals,
  startSymbol,
  productions,
});

// console.log("non terminals: ");
// console.log(getNonTerminalsToString(grammar));
// console.log("terminals: ");
// console.log(getTerminalsToString(grammar));
// console.log("productions: ");
// console.log(getProductionsToString(grammar));
// console.log("productions for A: ");
// console.log(getProductionsForNonTerminalToString(grammar, "A"));
// console.log("context free: ");
// console.log(checkContextFree(grammar));

const augmentedGrammar = createAugmentedGrammar(grammar);
// console.log("augmented grammar: ");
// console.log(JSON.stringify(augmentedGrammar, null, 2));

const canonicalCollection = toCanonicalCollection(augmentedGrammar);
// console.log("canonical collection: ");
// console.log(canonicalCollectionToString(canonicalCollection));

const parsingTable = collectionToParsingTable(
  canonicalCollection,
  augmentedGrammar
);

// console.log("parsingTable:");
// console.log(parsingTableToString(parsingTable));

const sequence = "abbc";
console.log(`parsing: ${sequence}`);

const parseProductions = parseSequence(
  `${sequence}`,
  parsingTable,
  augmentedGrammar
);
const derivations = toDerivationsString(`${sequence}`, parseProductions);

console.log(derivationsToString(derivations));
