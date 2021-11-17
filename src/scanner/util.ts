import { readLines } from "https://deno.land/std/io/mod.ts";

export const readFile = async (filename: string): Promise<Array<string>> => {
  const reader = await Deno.open(filename);
  const lines = [];
  for await (const line of readLines(reader)) lines.push(line);
  return lines;
};
