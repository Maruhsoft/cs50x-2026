#include <stdio.h>
#include <stdlib.h>
#include <time.h>

typedef struct person
{
    struct person *parents[2];
    char alleles[2];
}
person;

const int GENERATIONS = 3;

person *create_family(int generations)
{
    person *p = malloc(sizeof(person));

    if (p == NULL)
    {
        return NULL;
    }

    if (generations > 1)
    {
        p->parents[0] = create_family(generations - 1);
        p->parents[1] = create_family(generations - 1);

        p->alleles[0] = p->parents[0]->alleles[rand() % 2];
        p->alleles[1] = p->parents[1]->alleles[rand() % 2];
    }
    else
    {
        p->parents[0] = NULL;
        p->parents[1] = NULL;

        p->alleles[0] = "ABC"[rand() % 3];
        p->alleles[1] = "ABC"[rand() % 3];
    }

    return p;
}

void print_family(person *p, int generation)
{
    if (p == NULL)
    {
        return;
    }

    for (int i = 0; i < generation; i++)
    {
        printf("  ");
    }

    if (generation == 1)
    {
        printf("Child (Generation %i): blood type %c%c\n",
               generation, p->alleles[0], p->alleles[1]);
    }
    else
    {
        printf("Generation %i: blood type %c%c\n",
               generation, p->alleles[0], p->alleles[1]);
    }

    if (p->parents[0] != NULL)
    {
        print_family(p->parents[0], generation + 1);
        print_family(p->parents[1], generation + 1);
    }
}

void free_family(person *p)
{
    if (p == NULL)
    {
        return;
    }

    free_family(p->parents[0]);
    free_family(p->parents[1]);

    free(p);
}

int main(void)
{
    srand(time(0));

    person *p = create_family(GENERATIONS);

    if (p == NULL)
    {
        return 1;
    }

    print_family(p, 1);

    free_family(p);
}
