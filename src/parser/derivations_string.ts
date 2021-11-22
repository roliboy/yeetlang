import { Production } from "./grammar.ts";

export interface Derivation {
  production: Production;
  from: string;
  to: string;
}

/// Get list of derivations for an input using a set of productions
export const toDerivationsString = (
  input: string,
  productions: Array<Production>
) => {
  const derivations: Array<Derivation> = [];

  productions.forEach((production) => {
    const from = production.to.map((x) => x.value).join("");
    const to = production.from.value;

    const index = input.lastIndexOf(from);
    const head = input.substring(0, index);
    const tail = input.substring(index + from.length);

    derivations.push({
      production: production,
      from: input,
      to: head + to + tail,
    });

    input = head + to + tail;
  });

  return derivations;
};

export const derivationsToString = (derivations: Array<Derivation>) => {
  return derivations
    .map(
      (derivation) =>
        `${derivation.from} -> ${derivation.to}\n\t(${
          derivation.production.from.value
        } -> ${derivation.production.to.map((x) => x.value).join("")})`
    )
    .join("\n");
};
