// test/index.spec.ts
import { describe, it, expect } from 'vitest';
import { findWinningMove } from '../src/index';

describe('findWinningMove', () => {
	it('should find a winning move in a row', () => {
		const grid = [
			['X', 'X', null],
			['O', 'O', null],
			[null, null, null],
		];
		const result = findWinningMove(grid, 'X');
		expect(result).toEqual({ row: 0, col: 2 });
	});

	it('should find a winning move in a column', () => {
		const grid = [
			['X', 'O', null],
			['X', null, null],
			[null, 'O', null],
		];
		const result = findWinningMove(grid, 'X');
		expect(result).toEqual({ row: 2, col: 0 });
	});

	it('should find a winning move in the first diagonal', () => {
		const grid = [
			['X', 'O', null],
			['O', 'X', null],
			[null, null, null],
		];
		const result = findWinningMove(grid, 'X');
		expect(result).toEqual({ row: 2, col: 2 });
	});

	it('should return null if no winning move is available', () => {
		const grid = [
			['X', 'O', 'X'],
			['O', 'X', 'O'],
			['O', 'X', 'O'],
		];
		const result = findWinningMove(grid, 'X');
		expect(result).toBeNull();
	});
});
