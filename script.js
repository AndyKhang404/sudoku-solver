var grid = [];
for (var i = 0; i < 81; i++) {
	grid.push(0);
}
var allowedPatterns = /[^1-9 ]?$/;
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
