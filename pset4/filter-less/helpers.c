#include "helpers.h"
#include <math.h>
#include <stdlib.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int red = image[i][j].rgbtRed;
            int green = image[i][j].rgbtGreen;
            int blue = image[i][j].rgbtBlue;
            int avg = (int) round((red + green + blue) / 3.0);
            if (avg > 255)
            {
                avg = 255;
            }
            image[i][j].rgbtRed = (BYTE) avg;
            image[i][j].rgbtGreen = (BYTE) avg;
            image[i][j].rgbtBlue = (BYTE) avg;
        }
    }
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int red = image[i][j].rgbtRed;
            int green = image[i][j].rgbtGreen;
            int blue = image[i][j].rgbtBlue;

            int sepiaRed = (int) round(0.393 * red + 0.769 * green + 0.189 * blue);
            int sepiaGreen = (int) round(0.349 * red + 0.686 * green + 0.168 * blue);
            int sepiaBlue = (int) round(0.272 * red + 0.534 * green + 0.131 * blue);

            if (sepiaRed > 255)
            {
                sepiaRed = 255;
            }
            if (sepiaGreen > 255)
            {
                sepiaGreen = 255;
            }
            if (sepiaBlue > 255)
            {
                sepiaBlue = 255;
            }

            image[i][j].rgbtRed = (BYTE) sepiaRed;
            image[i][j].rgbtGreen = (BYTE) sepiaGreen;
            image[i][j].rgbtBlue = (BYTE) sepiaBlue;
        }
    }
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width / 2; j++)
        {
            RGBTRIPLE tmp = image[i][j];
            image[i][j] = image[i][width - 1 - j];
            image[i][width - 1 - j] = tmp;
        }
    }
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    // Allocate temporary copy
    RGBTRIPLE *temp = malloc(sizeof(RGBTRIPLE) * height * width);
    if (temp == NULL)
    {
        return;
    }

    // Copy pixels into 1D buffer for easier indexing
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            temp[i * width + j] = image[i][j];
        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int redSum = 0, greenSum = 0, blueSum = 0, count = 0;

            for (int di = -1; di <= 1; di++)
            {
                for (int dj = -1; dj <= 1; dj++)
                {
                    int ni = i + di;
                    int nj = j + dj;
                    if (ni >= 0 && ni < height && nj >= 0 && nj < width)
                    {
                        RGBTRIPLE p = temp[ni * width + nj];
                        redSum += p.rgbtRed;
                        greenSum += p.rgbtGreen;
                        blueSum += p.rgbtBlue;
                        count++;
                    }
                }
            }

            image[i][j].rgbtRed = (BYTE) round((float) redSum / count);
            image[i][j].rgbtGreen = (BYTE) round((float) greenSum / count);
            image[i][j].rgbtBlue = (BYTE) round((float) blueSum / count);
        }
    }

    free(temp);
}
