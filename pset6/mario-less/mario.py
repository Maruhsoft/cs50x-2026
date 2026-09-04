from cs50 import get_int

while True:
    height = get_int("Height: ")

    if 1 <= height <= 8:
        break

for i in range(height):
    print(" " * (height - i - 1) + "#" * (i + 1))
