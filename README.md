# TTTM Tic-Tac-Toe

This project is a Tic-Tac-Toe game implemented as a Cloudflare Worker. It provides an API to determine the best move for a given game state.

## Description

The project includes functions to parse the game grid, find winning moves, and determine the best move for the current player. It uses Cloudflare Workers to handle requests and respond with the best move.

## API Documentation

### `GET /`

#### Query Parameters

- `gid` (string): Game ID (optional).
- `size` (number): Size of the grid (e.g., 3 for a 3x3 grid).
- `playing` (string): The symbol of the current player (e.g., 'X' or 'O').
- `moves` (string): The current state of the grid in the format `symbol-row-col` separated by underscores (e.g., `X-0-0_O-1-1`).

#### Response

- `200 OK`: Returns the best move in the format `Move:<symbol>-<row>-<col>`.
- `200 OK`: Returns `Error:No valid moves left.` if no valid moves are available.

## How to Run the Project

### Prerequisites

- Node.js
- npm
- Cloudflare Wrangler CLI

### Installation

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Project

1. Start the development server:
    ```sh
    npm start
    ```

2. Deploy the project:
    ```sh
    npm run deploy
    ```

### Running Tests

To run the tests, use the following command:
```sh
npm test
