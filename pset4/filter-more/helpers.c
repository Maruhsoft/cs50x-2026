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
            if (avg > 255) avg = 255;
            image[i][j].rgbtRed = (BYTE) avg;
            image[i][j].rgbtGreen = (BYTE) avg;
            image[i][j].rgbtBlue = (BYTE) avg;
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
    RGBTRIPLE *temp = malloc(sizeof(RGBTRIPLE) * height * width);
    if (temp == NULL) return;

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

// Detect edges using Sobel operator
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    int Gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    int Gy[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

    RGBTRIPLE *temp = malloc(sizeof(RGBTRIPLE) * height * width);
    if (temp == NULL) return;

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
            int gxRed = 0, gxGreen = 0, gxBlue = 0;
            int gyRed = 0, gyGreen = 0, gyBlue = 0;

            for (int di = -1; di <= 1; di++)
            {
                for (int dj = -1; dj <= 1; dj++)
                {
                    int ni = i + di;
                    int nj = j + dj;
                    if (ni >= 0 && ni < height && nj >= 0 && nj < width)
                    {
                        RGBTRIPLE p = temp[ni * width + nj];
                        int kx = Gx[di + 1][dj + 1];
                        int ky = Gy[di + 1][dj + 1];
                        gxRed += p.rgbtRed * kx;
                        gxGreen += p.rgbtGreen * kx;
                        gxBlue += p.rgbtBlue * kx;
                        gyRed += p.rgbtRed * ky;
                        gyGreen += p.rgbtGreen * ky;
                        gyBlue += p.rgbtBlue * ky;
                    }
                }
            }

            int red = (int) round(sqrt(gxRed * gxRed + gyRed * gyRed));
            int green = (int) round(sqrt(gxGreen * gxGreen + gyGreen * gyGreen));
            int blue = (int) round(sqrt(gxBlue * gxBlue + gyBlue * gyBlue));

            if (red > 255) red = 255;
            if (green > 255) green = 255;
            if (blue > 255) blue = 255;

            image[i][j].rgbtRed = (BYTE) red;
            image[i][j].rgbtGreen = (BYTE) green;
            image[i][j].rgbtBlue = (BYTE) blue;
        }
    }

    free(temp);
}
