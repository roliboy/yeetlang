# lab 4

[https://github.com/roliboy/yeetlang](https://github.com/roliboy/yeetlang)


# EBNF

```ebnf
fa_file = states nl alphabet nl initial_state nl final_states nl transitions

states = state {", " state}
alphabet = value {", " value}
initial_state = state
final_states = state {", " state}

transitions = transition {nl transition}
transition = state ", " value "->" state

state = "A" | "B" ... "Z"
value = "0" | "1"
nl = <\n>
```