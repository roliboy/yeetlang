import { SymbolTable } from "./symbol_table.ts";
import { isNumber, isString, isBoolean, isIdentifier } from "./regex.ts";

export enum TokenType {
  IDENTIFIER = "IDENTIFIER",
  NUMBER_CONSTANT = "NUMBER_CONSTANT",
  STRING_CONSTANT = "STRING_CONSTANT",
  BOOLEAN_CONSTANT = "BOOLEAN_CONSTANT",

  // TODO: enum constants for reserved keywords, operators and separators
}

export interface Token {
  type: string;
  index: number;
}

export class InternalForm {
  private reserved: Array<string>;
  private tokens: Array<Token>;
  private symbolTable: SymbolTable<number | string>;

  // store reserved words, create an array to store tokens and instantiate a symbol table
  constructor({ reserved }: { reserved: Array<string> }) {
    this.reserved = reserved;
    this.tokens = new Array<Token>();
    this.symbolTable = new SymbolTable<number | string>({ capacity: 32 });
  }

  // add the atom to the token list
  // if it is a reserved word / operator / separator, add it directly, with index 0
  // otherwise try to classify it as an identifier or a constant, and get the index from the symbol table
  add(atom: string) {
    const type = this.reserved.includes(atom) ? atom : this.classify(atom);
    const index = this.reserved.includes(atom) ? 0 : this.symbolTable.get(atom);
    this.tokens.push({ type, index });
  }

  // dump token list
  getTokens() {
    return this.tokens
      .map((token) => `(${token.type}, ${token.index})`)
      .join("\n");
  }

  // dump symbols
  getSymbols() {
    return this.symbolTable
      .getSymbols()
      .map((symbol, index) => (symbol ? `${index}: ${symbol}` : symbol))
      .filter((x) => x)
      .join("\n");
  }

  // classify given atom in one of the categories, or throw an error if it can't be classified
  private classify(atom: string): TokenType {
    if (isNumber(atom)) return TokenType.NUMBER_CONSTANT;
    if (isString(atom)) return TokenType.STRING_CONSTANT;
    if (isBoolean(atom)) return TokenType.BOOLEAN_CONSTANT;
    if (isIdentifier(atom)) return TokenType.IDENTIFIER;
    throw new Error("could not classify atom");
  }
}
