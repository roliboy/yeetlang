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
