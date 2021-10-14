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
    no_argument_function  |
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
