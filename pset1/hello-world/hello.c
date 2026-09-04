#include <stdio.h>
#include <cs50.h>

int main(void)
{
    char *name = get_string("Name: ");
    if (name == NULL)
    {
        return 1;
    }
    printf("hello, %s\n", name);
    return 0;
}
