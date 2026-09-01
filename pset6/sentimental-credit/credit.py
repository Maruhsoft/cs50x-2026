from cs50 import get_string

number = get_string("Number: ")

total = 0
position = 0

for digit in reversed(number):
    value = int(digit)

    if position % 2 == 1:
        value *= 2

        if value >= 10:
            value = value // 10 + value % 10

    total += value
    position += 1

if total % 10 != 0:
    print("INVALID")
else:
    length = len(number)
    first_two = int(number[:2])
    first_digit = int(number[0])

    if length == 15 and first_two in (34, 37):
        print("AMEX")
    elif length == 16 and 51 <= first_two <= 55:
        print("MASTERCARD")
    elif length in (13, 16) and first_digit == 4:
        print("VISA")
    else:
        print("INVALID")
