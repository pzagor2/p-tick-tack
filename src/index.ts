// Helper function to parse the grid state
export function parseMoves(size: number, moves: string): (string | null)[][] {
	const grid = Array(size).fill(null).map(() => Array(size).fill(null));

	if (moves) {
		moves.split('_').forEach(move => {
			const [symbol, row, col] = move.split('-');
			grid[+row][+col] = symbol;
		});
	}

	return grid;
}

// Helper function to check for a win or block opportunity
export function findWinningMove(grid: (string | null)[][], symbol: string): { row: number, col: number } | null {
	const size = grid.length;

	// Check rows, columns, and diagonals
	const lines: { type: string, index?: number, line: (string | null)[] }[] = [];

	// Rows
	for (let row = 0; row < size; row++) {
		lines.push({ type: 'row', index: row, line: grid[row] });
	}

	// Columns
	for (let col = 0; col < size; col++) {
		const column = grid.map(row => row[col]);
		lines.push({ type: 'col', index: col, line: column });
	}

	// Diagonals
	const diag1 = grid.map((row, i) => row[i]);
	const diag2 = grid.map((row, i) => row[size - 1 - i]);

	lines.push({ type: 'diag1', line: diag1 });
	lines.push({ type: 'diag2', line: diag2 });

	// Find winning or blocking line
	for (const line of lines) {
		const countSymbol = line.line.filter(cell => cell === symbol).length;
		const countEmpty = line.line.filter(cell => cell === null).length;

		if (countSymbol === size - 1 && countEmpty === 1) {
			const emptyIndex = line.line.indexOf(null);

			if (line.type === 'row') return { row: line.index!, col: emptyIndex };
			if (line.type === 'col') return { row: emptyIndex, col: line.index! };
			if (line.type === 'diag1') return { row: emptyIndex, col: emptyIndex };
			if (line.type === 'diag2') return { row: emptyIndex, col: size - 1 - emptyIndex };
		}
	}

	return null;
}

// Helper function to get the best move
function getBestMove(grid: (string | null)[][], playing: string): { row: number, col: number } | null {
	const size = grid.length;
	const opponent = playing === 'X' ? 'O' : 'X';

	// Step 1: Try to win
	const winningMove = findWinningMove(grid, playing);
	if (winningMove) return winningMove;

	// Step 2: Try to block the opponent's win
	const blockingMove = findWinningMove(grid, opponent);
	if (blockingMove) return blockingMove;

	// Step 3: Take the center if available
	if (size === 3 && grid[1][1] === null) return { row: 1, col: 1 };

	// Step 4: Take a corner if available (for 3x3 grids)
	const corners = [
		{ row: 0, col: 0 },
		{ row: 0, col: size - 1 },
		{ row: size - 1, col: 0 },
		{ row: size - 1, col: size - 1 }
	];

	for (const corner of corners) {
		if (grid[corner.row][corner.col] === null) return corner;
	}

	// Step 5: Fallback to random empty position
	return getRandomEmptyPosition(grid);
}

// Helper function to get a random empty position
function getRandomEmptyPosition(grid: (string | null)[][]): { row: number, col: number } | null {
	const emptyPositions: { row: number, col: number }[] = [];

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (!grid[row][col]) {
				emptyPositions.push({ row, col });
			}
		}
	}

	if (emptyPositions.length > 0) {
		const randomIndex = Math.floor(Math.random() * emptyPositions.length);
		return emptyPositions[randomIndex];
	}

	return null;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const gid = url.searchParams.get('gid');
		const size = Number(url.searchParams.get('size'));
		const playing = url.searchParams.get('playing') || '';
		const moves = url.searchParams.get('moves') || '';

		// Parse the grid and determine the next move
		const grid = parseMoves(size, moves);
		const bestMove = getBestMove(grid, playing);

		if (bestMove) {
			return new Response(`Move:${playing}-${bestMove.row}-${bestMove.col}`, {
				status: 200,
			});
		} else {
			return new Response("Error:No valid moves left.", {
				status: 200,
			});
		}
	},
} satisfies ExportedHandler<Env>;
