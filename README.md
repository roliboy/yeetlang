# yeetlang

language specification required for my `formal languages and compiler design` course.



## overview

yeetlang combines the clarity of ruby with the simplicity of lisp, resulting in a completely unusable language.

general syntax and statements are similar to those of modern imperative programming languages, while expressions are written in lisp-style prefix notation (minus the parantheses)

## examlpe programs

### fibonacci sequence

```yeet
decl limit number 10
decl sequence (number) (0, 1)

decl index number 2

while < index limit
    decl t1 number @ sequence - index 2
    decl t2 number @ sequence - index 1

    set @ sequence index + t1 t2

    set index + index 1
end

set index 0

while < index limit
    -> @ sequence index
    set index + index 1
end
```

### max of three numbers

```yeet
decl a number 1
decl b number 2
decl c number 3

decl max number a

if > b max
    set max b
end

if > c max
    set max c
end

-> max
```

or

```yeet
decl a number 1
decl b number 2
decl c number 3

-> ? > a b ? > a c a c ? > b c b c
```


### roots of quadratic equation

```yeet
decl a number 2
decl b number 3
decl c number 4

decl delta number - ^ b 2 * 4 * a c
decl r1 number / + 😂 b ^ delta 0.5 * 2 a
decl r2 number / - 😂 b ^ delta 0.5 * 2 a

-> r1
-> r2
```

### sum of numbers from stdin

```yeet
decl sum number 0
decl n number 5

while > n 0
    set sum + sum ># <-
    set n - n 1
end

-> sum
```


## special symbols

- operators:
    - `<-` - input
    - `->` - output
    - `>#` - parse number
    - `!` - logic negation
    - `😂` - arithmetic negation
    - `@` - array indexing
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
    - `,` - separating elements of list literals
    - `(` - beginning of list literal or list type declaration
    - `)` - end of list literal or list type declaration
- reserved words:
    - `decl` - declare a new variable
    - `set` - set value of a variable
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
    string_constant = "'" {character} "'"
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
    declaration_statement | # variable declaration (decl yeet (string) => string yeet[])
    assignment_statement  | # variable assignment (set yeet 42 => yeet = 42)
    while_statement       |
    if_statement          |
    expression
    

declaration_statement = "decl" <identifier> type expression
assignment_statement = "set" variable expression
while_statement = "while" expression newline program "end"
if_statement = "if" expression newline program
              {"elif" expression newline program}
              ["else" newline program]
               "end"

type = primitive_type | list_type
primitive_type = "number" | "string" | "boolean"
list_type = "(" type ")"

variable = <identifier> | list_element
list_element = "@" <identifier> expression

expression =
    function_expression |
    value_expression

function_expression =
    no_argument_function |
    one_argument_function |
    two_argument_function |
    three_argument_function

no_argument_function = no_argument_function_symbol
no_argument_function_symbol = "<-" # input (reads one word from stdin)

one_argument_function = one_argument_function_symbol expression
one_argument_function_symbol = "->" | # output (write one value to stdout)
                               ">#" | # parse number (># "42" => 42)
                               "!"  | # logic negation (! true => false, ! false => true)
                               "😂" # arithmetic negation (😂 42 => -42)

two_argument_function = two_argument_function_symbol expression expression
two_argument_function_symbol = "+"  | # addition (+ 4 2 => 4)
                               "-"  | # subtraction (- 4 2 => 1)
                               "*"  | # multiplication (* 4 2 => 8)
                               "/"  | # division (/ 4 2 => 2)
                               "^"  | # exponentiation (^ 4 2 => 16)
                               "==" | # equality (== 4 2 => false)
                               "!=" | # inequality (!= 4 2 => true)
                               "<=" | # less than or equal (<= 4 2 => false)
                               ">=" | # greater than or equal (>= 4 2 => true)
                               "<"  | # less than (< 4 2 => false)
                               ">"  | # greater than (> 4 2 => false)
                               "&"  | # conjunction (& true false => false)
                               "|"  # disjunction (| true false => true)

three_argument_function = three_argument_function_symbol expression expression expression 
three_argument_function_symbol = "?" # conditional (? true 4 2 => 4)

value_expression = primitive_value | list_value
primitive_value = variable | constant
list_value = "()" | ("(" expression {"," expression} ")")

constant = <number_constant> | <string_constant> | <boolean_constant>

newline = "\n"

```