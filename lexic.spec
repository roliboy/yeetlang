identifier = letter {(letter | special_character | digit)}
letter = "a" | "b" | ... | "z"
special_character = "_"
digit = "0" | "1" | ... | "9"


number_constant = "0" | (["-"] non_zero_digit {digit} ["." digit {digit}])
non_zero_digit = "1" | "2" | ... | "9"
digit = "0" | non_zero_digit

string_constant = "'" {character} "'"
character = letter | digit | special
letter = "a" | "b" | ... | "z" | "A" | "B" | ... | "Z"
special_character = "_" | " "
digit = "0" | "1" | ... | "9"

boolean_constant = "true" | "false"
