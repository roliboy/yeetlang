export class FiniteAutomata {
  private states: Array<string>;
  private alphabet: Array<string>;
  private initialState: string;
  private finalStates: Array<string>;
  private transitions: Array<Array<string>>;

  constructor({
    states,
    alphabet,
    initialState,
    finalStates,
    transitions,
  }: {
    states: Array<string>;
    alphabet: Array<string>;
    initialState: string;
    finalStates: Array<string>;
    transitions: Array<Array<string>>;
  }) {
    this.states = states;
    this.alphabet = alphabet;
    this.initialState = initialState;
    this.finalStates = finalStates;
    this.transitions = transitions;
  }

  getStates() {
    return this.states.join(", ");
  }

  getAlphabet() {
    return this.alphabet.join(", ");
  }

  getInitialState() {
    return this.initialState;
  }

  getFinalStates() {
    return this.finalStates.join(", ");
  }

  getTransitions() {
    return this.transitions
      .map((xs) => `${xs[0]}, ${xs[1]} -> ${xs[2]}`)
      .join("\n");
  }

  verifiy(s: string) {
    let currentState = this.initialState;
    for (const c of s.split("")) {
      if (!this.alphabet.includes(c)) return "invalid character";
      const transition = this.transitions.find(
        (t) => t[0] == currentState && t[1] == c
      );
      if (!transition) return "invalid transition";
      currentState = transition[2];
    }
    return "valid sequence";
  }
}
