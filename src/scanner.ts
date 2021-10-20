import { parse } from "https://deno.land/std/flags/mod.ts";

import { InternalForm } from "./internal_form.ts";
import { readFile } from "./util.ts";
import { extractAtoms } from "./regex.ts";

const args = parse(Deno.args);

if (!args.i) {
  console.log("no input file provided");
  Deno.exit(1);
}

const reservedTokens = await readFile("token.in");
const internalForm = new InternalForm({ reserved: reservedTokens });
const input = await readFile(args.i);

input.forEach((line, lineNumber) => {
  extractAtoms(line).forEach((token) => {
    try {
      internalForm.add(token);
    } catch (error) {
      const { message } = error as Error;
      console.error(
        `lexical error: ${message}: '${token}' on line ${lineNumber}`
      );
      Deno.exit(2);
    }
  });
});

console.log("lexically correct");

await Deno.writeTextFile("./pif.out", internalForm.getTokens());
await Deno.writeTextFile("./st.out", internalForm.getSymbols());
