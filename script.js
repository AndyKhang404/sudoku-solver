var grid = [];
for (var i = 0; i < 81; i++) {
	grid.push(0);
}
var allowedPatterns = /[^1-9 ]?$/;

class SudokuBoard {

	constructor() {
		this.board = [];
		for (var i = 0; i < 9; i++) {
			this.board.push([]);
			for (var j = 0; j < 9; j++) {
				this.board[i].push(0);
			}
		}

		let mask = (1<<1) | (1<<2) | (1<<3) | (1<<4) | (1<<5) | (1<<6) | (1<<7) | (1<<8) | (1<<9);
		this.rowMask = [];
		for (var i = 0; i < 9; i++) {
			this.rowMask.push(mask);
		}
		this.colMask = [];
		for (var i = 0; i < 9; i++) {
			this.colMask.push(mask);
		}
		this.boxMask = [];
		for (var i = 0; i < 9; i++) {
			this.boxMask.push(mask);
		}
		this.cellMask = [];
		for (var i = 0; i < 9; i++) {
			this.cellMask.push([]);
			for (var j = 0; j < 9; j++) {
				this.cellMask[i].push(mask);
			}
		}

		this.peers = [];
		for(var i = 0; i < 9; i++){
			this.peers.push([]);
			for(var j = 0; j < 9; j++){
				this.peers[i].push([]);
				for(var k = 0; k < 9; k++){
					if(k == i || k == j){
						continue;
					}
					this.peers[i][j].push(structuredClone([i,k]));
					this.peers[i][j].push(structuredClone([k,j]));
				}
				for(var k = Math.floor(i / 3) * 3; k < Math.floor(i / 3) * 3 + 3; k++){
					if(k == i){
						continue;
					}
					for(var l = Math.floor(j / 3) * 3; l < Math.floor(j / 3) * 3 + 3; l++){
						if(l == j){
							continue;
						}
						this.peers[i][j].push(structuredClone([k,l]));
					}
				}
			}
		}
	}

	stringify() {
		let str = '';
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if(this.board[i][j] == 0) {
					str += '.';
				} else {
					str += this.board[i][j];
				}
			}
		}
		return str;
	}

	parseBoard(str) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if(str[i * 9 + j] == '.') {
					this.board[i][j] = 0;
				} else {
					this.board[i][j] = str[i * 9 + j];
				}
			}
		}
	}

	makeMove(row, col, num) {
		if(this.cellMask[row][col] & (1<<num) == 0) {
			return false;
		}
		this.board[row][col] = num;
		this.rowMask[row] ^= (1<<num);
		this.colMask[col] ^= (1<<num);
		this.boxMask[Math.floor(row / 3) * 3 + Math.floor(col / 3)] ^= (1<<num);
		this.cellMask[row][col] = 0;
		this.peers[row][col].forEach(peer => {
			this.cellMask[peer[0]][peer[1]] &= ~(1<<num);
		});
		return true;
	}

	bitCount(mask) {
		let count = 0;
		while(mask != 0) {
			mask &= (mask - 1);
			count++;
		}
		return count;
	}

	// https://norvig.com/sudoku.html
	
}

var mainBoard = new SudokuBoard();

var rowCheck = [
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
];
var colCheck = [
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
];
var subcellCheck = [
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
];
var row = [
	0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,
	3,3,3,4,4,4,5,5,5,3,3,3,4,4,4,5,5,5,3,3,3,4,4,4,5,5,5,
	6,6,6,7,7,7,8,8,8,6,6,6,7,7,7,8,8,8,6,6,6,7,7,7,8,8,8
];
var col = [
	0,1,2,0,1,2,0,1,2,3,4,5,3,4,5,3,4,5,6,7,8,6,7,8,6,7,8,
	0,1,2,0,1,2,0,1,2,3,4,5,3,4,5,3,4,5,6,7,8,6,7,8,6,7,8,
	0,1,2,0,1,2,0,1,2,3,4,5,3,4,5,3,4,5,6,7,8,6,7,8,6,7,8
];

function solveSudoku(grid) {
	for(i = 0; i < 9; i++) {
		for(j = 0; j < 9; j++) {
			rowCheck[i][j] = 1;
			colCheck[i][j] = 1;
			subcellCheck[i][j] = 1;
		}
	}
	document.getElementById('status').innerHTML = 'Solving...';
	document.getElementById('solve').disabled = true;
	document.getElementById('clear').disabled = true;
	for(i = 0; i < 81; i++) {
		if(grid[i] != 0) {
			rowCheck[row[i]][grid[i] - 1] = 0;
			colCheck[col[i]][grid[i] - 1] = 0;
			subcellCheck[Math.floor(i / 9)][grid[i] - 1] = 0;
		}
	}
	if(solveSudokuBacktrack(grid)){
		for(i = 0; i < 81; i++) {
			document.getElementById('' + i).value = grid[i];
		}
		document.getElementById('status').innerHTML = 'Solved';
	} else {
		document.getElementById('status').innerHTML = 'No solution';
	}
	document.getElementById('solve').disabled = false;
	document.getElementById('clear').disabled = false;
}

function isValidMove(i, num) {
	if(rowCheck[row[i]][num - 1] == 0 || colCheck[col[i]][num - 1] == 0 || subcellCheck[Math.floor(i / 9)][num - 1] == 0) {
		return false;
	}
	return true;
}

function solveSudokuBacktrack(grid){
	var i = 0;
	while(i < 81){
		if(grid[i] == 0){
			for(var j = 1; j <= 9; j++){
				if(isValidMove(i, j)){
					grid[i] = j;
					rowCheck[row[i]][j - 1] = 0;
					colCheck[col[i]][j - 1] = 0;
					subcellCheck[Math.floor(i / 9)][j - 1] = 0;
					if(solveSudokuBacktrack(grid)){
						return true;
					}
					grid[i] = 0;
					rowCheck[row[i]][j - 1] = 1;
					colCheck[col[i]][j - 1] = 1;
					subcellCheck[Math.floor(i / 9)][j - 1] = 1;
				}
			}
			return false;
		}
		i++;
	}
	console.log("Solved");
	return true;
}

// Event handlers

for (var i = 0; i < 80; i++) {
	document.getElementById('' + i).addEventListener('focus', function(e) {
		this.select();
	});
	document.getElementById('' + i).addEventListener('input', function(e) {
		this.value = this.value.replace(allowedPatterns, '');
		if(e.inputType === 'insertText' && this.value.length >= 1) {
			document.getElementById('' + (parseInt(this.id) + 1)).focus();
		}
	});
}

document.getElementById('80').addEventListener('input', function(e) {
	this.value = this.value.replace(allowedPatterns, '');
	if(e.inputType === 'insertText' && this.value.length >= 1) {
		document.getElementById('solve').focus();
	}
})

document.getElementById('solve').addEventListener('click', function() {
	for (var i = 0; i < 81; i++) {
		grid[i] = parseInt(document.getElementById('' + i).value);
		if(isNaN(grid[i])) {
			grid[i] = 0;
		}
	}
	solveSudoku(grid);
});

document.getElementById('clear').addEventListener('click', function() {
	for (var i = 0; i < 81; i++) {
		document.getElementById('' + i).value = '';
	}
});
