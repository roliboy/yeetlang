export const extractAtoms = (sequence: string): Array<string> =>
  sequence.split(/('.*?')|[ ]|(?<=\w)(?=\W)|(?<=\W)(?=\w)/).filter((x) => x);

export const isNumber = (token: string): boolean =>
  /^[-]?[0-9]+(\.[0-9]+)?$/.test(token);

export const isString = (token: string): boolean => /^'[^']*'?$/.test(token);

export const isBoolean = (token: string): boolean =>
  /^(true|false)$/.test(token);

export const isConstant = (token: string): boolean =>
  isNumber(token) || isString(token) || isBoolean(token);

export const isIdentifier = (token: string): boolean =>
  /^[a-z][a-z0-9]*$/.test(token);
