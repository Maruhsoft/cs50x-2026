#include <cs50.h>
#include <ctype.h>
#include <stdio.h>
#include <string.h>

int main(int argc, string argv[])
{
    if (argc != 2 || strlen(argv[1]) != 26)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }

    for (int i = 0; i < 26; i++)
    {
        if (!isalpha((unsigned char) argv[1][i]))
        {
            printf("Usage: ./substitution key\n");
            return 1;
        }

        for (int j = i + 1; j < 26; j++)
        {
            if (tolower((unsigned char) argv[1][i]) ==
                tolower((unsigned char) argv[1][j]))
            {
                printf("Usage: ./substitution key\n");
                return 1;
            }
        }
    }

    string plaintext = get_string("plaintext: ");

    printf("ciphertext: ");

    for (int i = 0, n = strlen(plaintext); i < n; i++)
    {
        char c = plaintext[i];

        if (isupper((unsigned char) c))
        {
            printf("%c", toupper((unsigned char) argv[1][c - 'A']));
        }
        else if (islower((unsigned char) c))
        {
            printf("%c", tolower((unsigned char) argv[1][c - 'a']));
        }
        else
        {
            printf("%c", c);
        }
    }

    printf("\n");
    return 0;
}
