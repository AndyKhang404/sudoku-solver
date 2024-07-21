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

		this.initMask();
		this.initPeers();
	}

	static fromString(str) {
		var board = new SudokuBoard();
		if(board.parseBoard(str) === false) {
			alert('Invalid sudoku');
			throw new Error('Invalid sudoku');
		}
		return board;
	}

	initMask() {
		let mask = (1<<1) | (1<<2) | (1<<3) | (1<<4) | (1<<5) | (1<<6) | (1<<7) | (1<<8) | (1<<9);
		this.cellMask = [];
		for (var i = 0; i < 9; i++) {
			this.cellMask.push([]);
			for (var j = 0; j < 9; j++) {
				this.cellMask[i].push(mask);
			}
		}
	}

	initPeers() {
		this.peers = [];
		for(var i = 0; i < 9; i++){
			this.peers.push([]);
			for(var j = 0; j < 9; j++){
				this.peers[i].push([]);
				for(var k = 0; k < 9; k++){
					if(k == j){
						continue;
					}
					this.peers[i][j].push(structuredClone([i,k]));
				}
				for(var k = 0; k < 9; k++){
					if(k == i){
						continue;
					}
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
		if(str.length !== 81) return false;
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if(str[i * 9 + j] != '.' && str[i * 9 + j] != '0') {
					var check = this.assign(i, j, parseInt(str[i * 9 + j]));
					if(check === false) {
						return false;
					}
				}
			}
		}
		return true;
	}

	static bitCount(mask) {
		let count = 0;
		while(mask != 0) {
			mask &= (mask - 1);
			count++;
		}
		return count;
	}

	// https://norvig.com/sudoku.html

	static cellValueLookup = {
		2: 1,
		4: 2,
		8: 3,
		16: 4,
		32: 5,
		64: 6,
		128: 7,
		256: 8,
		512: 9,
	}

	assign(row, col, num) {
		if(this.board[row][col] === num) {
			return true;
		}
		if(!(this.cellMask[row][col] & (1<<num)) || this.board[row][col] !== 0 || num < 1 || num > 9) {
			return false;
		}
		this.board[row][col] = num;
		for(var num2 = 1; num2 <= 9; num2++) {
			if(num2 === num) {
				continue;
			}
			if(this.eliminate(row, col, num2) === false) {
				// console.log(row, col, num2);
				return false;
			}
		}
		return true;
	}

	eliminate(row, col, num) {
		// console.log('here2',row,col,num);
		if(!(this.cellMask[row][col] & (1<<num))) {
			return true;
		}
		this.cellMask[row][col] &= ~(1<<num);
		// If a cell has only one possible value, eliminate that value from its peers
		if(this.cellMask[row][col] === 0) {
			return false; // Contradiction: removed last value
		}
		else if(SudokuBoard.bitCount(this.cellMask[row][col]) === 1) {
			// console.log(row,col,num);
			for(var i = 0; i < this.peers[row][col].length; i++) {
				var peer = this.peers[row][col][i];
				if(this.eliminate(peer[0], peer[1], SudokuBoard.cellValueLookup[this.cellMask[row][col]]) === false) {
					// console.log(peer,'check1');
					return false;
				}
			}
		}
		// If a unit has only one possible place for a value, assign it there
		var count = 0, index = -1;
		for(var i = 0; i < 9; i++) {
			if((1<<num) & this.cellMask[row][i]) {
				count++; index = i;
			}
		}
		if(count === 0) {
			return false; // Contradiction: no place for this value
		}
		else if(count === 1) {
			if(this.assign(row,index,num) === false) {
				return false;
			}
		}

		count = 0; index = -1;
		for(var i = 0; i < 9; i++) {
			if((1<<num) & this.cellMask[i][col]) {
				count++; index = i;
			}
		}
		if(count === 0) {
			return false; // Contradiction: no place for this value
		}
		else if(count === 1) {
			if(this.assign(index, col, num) === false) {
				return false;
			}
		}

		count = 0; index = 0; var jndex = 0;
		for(var i = Math.floor(row / 3) * 3; i < Math.floor(row / 3) * 3 + 3; i++) {
			for(var j = Math.floor(col / 3) * 3; j < Math.floor(col / 3) * 3 + 3; j++) {
				if((1<<num) & this.cellMask[i][j]) {
					count++; index = i; jndex = j;
				}
			}
		}
		if(count === 0) {
			return false; // Contradiction: no place for this value
		}
		else if(count === 1) {
			if(this.assign(index, jndex, num) === false) {
				return false;
			}
		}
		return true;
	}

	static maskToInts(mask) {
		var ints = [];
		for(var i = 1; i <= 9; i++) {
			if(mask & (1<<i)) {
				ints.push(i);
			}
		}
		return ints;
	}
}

// Global solution counter
var solCount = 0;
var solObj;

function search(stat){
	var s = SudokuBoard.fromString(stat.str);
	var places = s.cellMask
		.flat()
		.map((v, i) => [i, SudokuBoard.maskToInts(v)])
		.filter(v => v[1].length > 1)
		.sort((a, b) => a[1].length - b[1].length)
		.map(v => v[0]);
	if(places.length === 0){
		return {str: stat.str, solved: true};
	}
	var ints = SudokuBoard.maskToInts(s.cellMask[Math.floor(places[0] / 9)][places[0] % 9]);
	for(var j = 0; j < ints.length; j++){
		var s = SudokuBoard.fromString(stat.str);
		if(s.assign(Math.floor(places[0] / 9), places[0] % 9, ints[j]) === false){
			continue;
		}
		var res = search({str: s.stringify(), solved: false});
		if(res.solved){
			solCount++;
			solObj = res;
			if(solCount > 1){
				return res;
			}
		}
	}
	if(solCount === 1){
		return solObj;
	}
	return {str: stat.str, solved: false};
}

function solve(str){
	solCount = 0;
	var s = SudokuBoard.fromString(str);
	if(s.cellMask.flat().filter(v => SudokuBoard.bitCount(v) === 1).length === 81){
		return {str: s.stringify(), solved: true};
	}
	return search({str: s.stringify(), solved: false});
}

var mainStr = [];
for(var i = 0; i < 81; i++){
	mainStr.push('');
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

function swapBoardStrFormat(uiBoardStr){
	var inBoardStr = [];
	for(var i = 0; i < 81; i++){
		inBoardStr.push("");
	}
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			for(var k = 0; k < 3; k++){
				for(var l = 0; l < 3; l++){
					inBoardStr[i * 27 + j * 9 + k * 3 + l] = uiBoardStr[i * 27 + j * 3 + k * 9 + l];
				}
			}
		}
	}
	return inBoardStr;
}

document.getElementById('solve').addEventListener('click', function() {
	for(var i = 0; i < 81; i++){
		mainStr[i] = document.getElementById('' + i).value;
	}
	var parsedStr = mainStr.map(v => (isNaN(parseInt(v)) || v === '0') ? '.' : v);
	var boardStr = swapBoardStrFormat(parsedStr);
	var solvedObj = solve(boardStr.join(''));
	if(solvedObj.solved === false){
		alert('No solution exists');
		return;
	}
	var solvedStr = swapBoardStrFormat(solvedObj.str);
	for(var i = 0; i < 81; i++){
		document.getElementById('' + i).value = solvedStr[i];
	}
	if(solCount > 1){
		alert('Multiple solutions exist');
	}
});

document.getElementById('clear').addEventListener('click', function() {
	for (var i = 0; i < 81; i++) {
		document.getElementById('' + i).value = '';
	}
});

document.getElementById('import').addEventListener('click', function() {
	var str = prompt('Enter an 81-character string representing the sudoku board, any characters other than 1-9 will be treated as empty:');
	if(!str) return;
	if(str.length !== 81) {
		alert('Invalid board');
		return;
	}
	var parsedStr = str.split('').map(v => (isNaN(parseInt(v)) || v === '0') ? ' ' : v).join('');
	var uiStr = swapBoardStrFormat(parsedStr);
	for(var i = 0; i < 81; i++){
		document.getElementById('' + i).value = uiStr[i];
	}
});