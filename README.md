# Classic MineSweeper Game

## Developed with:
- React, Redux Toolkit, Router, TypeScript.

## Screenshots
<img src='/screenshots/1-home-screen.png' height='400' width='400' /> <img src='/screenshots/2-game-config.png' height='400' width='400' />
<img src='/screenshots/3-game-in-progress-1.png' height='400' width='400' /> <img src='/screenshots/4-game-in-progress-2.png' height='400' width='400' />
<img src='/screenshots/5-game-in-progress-3.png' height='400' width='400' /> <img src='/screenshots/6-game-in-progress-4.png' height='400' width='400' />
<img src='/screenshots/7-game-won.png' height='400' width='400' /> <img src='/screenshots/8-game-lost.png' height='400' width='400' />

## Features

- Customize your new game's number of rows, columns and mines.
- Guaranty that there will be no mine on the first tile you click.
- When a zero tile is clicked, all adjacent zero tiles will show.
- Right click to flag a tile where you believe there is a mine, so you won't reveal it by accident.
- Top game bar:
  - Left: Counter showing how many mines are left depending on the number of flags placed, whether correctly or incorrectly.
  - Center: Reset button that loads a new game with the previously selected configuration.
  - Right: Timer that starts counting strating on the first tile clicked.
- When the game is finished:
  - Home button to go home and select a new game cofiguration.
  - Play again button that loads a new game with the previously selected configuration.
