import { SymbolTable } from "./main.ts";

const testOnLookupReturnsPositionIfElementAlreadyExists = () => {
  console.log(
    "running test: on lookup returns position if element already exists"
  );

  const symbolTable = new SymbolTable<string | number>({ capacity: 10 });

  const initialValueIndex = symbolTable.get("abc");
  console.log(`initial value 'abc', index: ${initialValueIndex}`);

  const lookupValueIndex = symbolTable.get("abc");
  console.log(`lookup value 'abc', index: ${lookupValueIndex}`);

  if (lookupValueIndex != initialValueIndex) {
    console.error("returned indices do not match");
  }

  symbolTable.draw();
};

const testOnCollisionElementIsPlacedInNextEmptyCell = () => {
  console.log(
    "running test: on collision element is placed in next empty cell"
  );

  const symbolTable = new SymbolTable<string | number>({ capacity: 10 });

  const firstValueIndex = symbolTable.get(2);
  console.log(`inserted value 2, index: ${firstValueIndex}`);

  const secondValueIndex = symbolTable.get(12);
  console.log(`inserted value 12, index: ${secondValueIndex}`);

  if (secondValueIndex != firstValueIndex + 1) {
    console.error("element was not placed on first empty cell");
  }

  symbolTable.draw();
};

const testOnCapacityFullThrowsError = () => {
  console.log("running test: on capacity full throws error");

  const symbolTable = new SymbolTable<string | number>({ capacity: 4 });

  const firstValueIndex = symbolTable.get("lorem");
  console.log(`inserted value 'lorem', index: ${firstValueIndex}`);

  const secondValueIndex = symbolTable.get("ipsum");
  console.log(`inserted value 'ipsum', index: ${secondValueIndex}`);

  const thirdValueIndex = symbolTable.get("dolor");
  console.log(`inserted value 'dolor', index: ${thirdValueIndex}`);

  const fourthValueIndex = symbolTable.get("sit");
  console.log(`inserted value 'sit', index: ${fourthValueIndex}`);

  try {
    const fifthValueIndex = symbolTable.get("amet");
    console.log(`inserted value 'sit', index: ${fifthValueIndex}`);
  } catch (_) {
    console.log("symbol table is full");
  }

  symbolTable.draw();
};

testOnLookupReturnsPositionIfElementAlreadyExists();
testOnCollisionElementIsPlacedInNextEmptyCell();
testOnCapacityFullThrowsError();
