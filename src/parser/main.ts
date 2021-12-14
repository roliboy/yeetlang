import { parse } from "https://deno.land/std/flags/mod.ts";
import { readFile } from "./util.ts";
import { grammarFromRaw, createAugmentedGrammar } from "./grammar.ts";
import { toCanonicalCollection } from "./canonical_collection.ts";
import { createParsingTable } from "./parsing_table.ts";
import { parseSequence } from "./parser.ts";
import { reconstructParserOutput } from "./parser_output.ts";

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

const initialGrammar = grammarFromRaw({
  nonTerminals,
  terminals,
  startSymbol,
  productions,
});

const augmentedGrammar = createAugmentedGrammar(initialGrammar);

const canonicalCollection = toCanonicalCollection(augmentedGrammar);

// console.log(JSON.stringify({ canonicalCollection }, null, 2));

const parsingTable = createParsingTable(canonicalCollection, augmentedGrammar);

const sequence = "abda";
const parsedSequence = parseSequence(parsingTable, augmentedGrammar, sequence);

const snapshots = reconstructParserOutput(parsedSequence, augmentedGrammar);

snapshots.forEach((snapshot) => {
  console.log(snapshot.map((x) => x.value).join(""));
});
