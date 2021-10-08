# yeetlang

language specification required for my `formal languages and compiler design` course.



## overview

yeetlang combines the clarity of ruby with the simplicity of lisp, resulting in a completely unusable language.

general syntax and statements are similar to those of modern imperative programming languages, while expressions are written in lisp-style prefix notation (minus the parantheses)

## examlpe programs

### max of three numbers

```yeet
a: number = 1
b: number = 2
c: number = 3

max: number = a

if > b max
    max = b
end

if > c max
    max = c
end

-> max
```

or

```yeet
a: number = 1
b: number = 2
c: number = 3

-> ? > a b ? > a c a c ? > b c b c
```


### roots of quadratic equation

```yeet
a: number = 2
b: number = 3
c: number = 4

delta: number = - ^ b 2 * 4 * a c
-> / + 😂 b ^ delta 0.5 * 2 a
-> / - 😂 b ^ delta 0.5 * 2 a
```

### sum of numbers from stdin

```yeet
sum: number = 0
n: number = 5

while > n 0
    sum = + sum ># <-
    n = - n 1
end

-> sum
```


## special symbols

- operators:
    - `=` - assignment
    - `<-` - input
    - `->` - output
    - `>#` - parse number
    - `!` - logic negation
    - `😂` - arithmetic negation
    - `+` - addition
    - `-` - subtraction
    - `*` - multiplication
    - `/` - division
    - `^` - exponentiation
    - `==` - equality
    - `!=` - inequality
    - `<` - less than
    - `<=` - less than or equal
    - `>` - greater than
    - `>=` - greater than or equal
    - `&` - conjunction
    - `|` - disjunction
    - `?` - conditional expression
- separators:
    - `<space>` - separating atoms
    - `<newline>` - separating statements
    - `:` - separating variable from type annotation
    - `,` - separating elements of list literals
    - `(` - beginning of list literal or list type declaration
    - `)` - end of list literal or list type declaration
- reserved words:
    - `while` - beginning of while statement
    - `if` - beginning of if statement
    - `elif` - "else if" branch of if statement
    - `else` - else branch of if statement
    - `end` - generic keyword for ending statements
    - `number` - number variable type
    - `string` - string variable type
    - `boolean` - boolean variable type



## EBNF rules

### identifiers

sequence of letters and digits, with the first character being a letter
```ebnf
identifier = letter {(letter | special_character | digit)}
letter = "a" | "b" | ... | "z"
special_character = "_"
digit = "0" | "1" | ... | "9"
```

### constants

- number
    ```ebnf
    number_constant = "0" | (["-"] non_zero_digit {digit} ["." digit {digit}])
    non_zero_digit = "1" | "2" | ... | "9"
    digit = "0" | non_zero_digit
    ```

- string
    ```ebnf
    string_constant = "'" {string} "'"
    character = letter | digit | special
    letter = "a" | "b" | ... | "z" | "A" | "B" | ... | "Z"
    special_character = "_" | " "
    digit = "0" | "1" | ... | "9"
    ```

- boolean
    ```ebnf
    boolean_constant = "true" | "false"
    ```


### syntax

```ebnf
program = {statement newline}

statement =
    declaration_statement |
    assignment_statement |
    while_statement |
    if_statement |
    expression
    

declaration_statement = <identifier> ":" type ["=" expression]
assignment_statement = <identifier> "=" expression
while_statement = "while" expression newline program "end"
if_statement = "if" expression newline program {"elif" expression newline program} ["else" newline program] "end"

type = primitive_type | list_type
primitive_type = "number" | "string" | "boolean"
list_type = "(" type ")"


expression =
    function_expression |
    value_expression

function_expression =
    no_argument_function |
    one_argument_function |
    two_argument_function |
    three_argument_function

no_argument_function = no_argument_function_symbol
no_argument_function_symbol = "<-"

one_argument_function = one_argument_function_symbol expression
one_argument_function_symbol = "->" | ">#" | "!" | "😂"

two_argument_function = two_argument_function_symbol expression expression
two_argument_function_symbol = "+" | "-" | "*" | "/" | "^" | "==" | "!=" | "<=" | ">=" | ">" | "<" | "&" | "|"

three_argument_function = three_argument_function_symbol expression expression expression 
three_argument_function_symbol = "?"

value_expression = primitive_value | list_value
primitive_value = <identifier> | constant
list_value = "()" | ("(" expression {"," expression} ")")

constant = <number_constant> | <string_constant> | <boolean_constant>

newline = "\n"

```