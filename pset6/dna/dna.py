import csv
import sys


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    for i in range(sequence_length):
        count = 0

        while True:
            start = i + count * subsequence_length
            end = start + subsequence_length

            if sequence[start:end] == subsequence:
                count += 1
            else:
                break

        longest_run = max(longest_run, count)

    return longest_run


if len(sys.argv) != 3:
    print("Usage: python dna.py data.csv sequence.txt")
    sys.exit(1)

database_file = sys.argv[1]
sequence_file = sys.argv[2]

with open(database_file) as file:
    reader = csv.DictReader(file)
    rows = list(reader)
    strs = reader.fieldnames[1:]

with open(sequence_file) as file:
    sequence = file.read().strip()

counts = {}

for str_name in strs:
    counts[str_name] = longest_match(sequence, str_name)

for row in rows:
    match = True

    for str_name in strs:
        if int(row[str_name]) != counts[str_name]:
            match = False
            break

    if match:
        print(row["name"])
        sys.exit(0)

print("No match")
