var index = 0;

document.getElementById('solve').addEventListener('click', function() {
	// console.log(document.getElementById('cell-0').firstChild.value);
	// document.getElementById('cell-80').firstChild.focus();
});

document.getElementById('clear').addEventListener('click', function() {
	for (var i = 0; i < 81; i++) {
		document.getElementById('' + i).value = '';
	}
});

var allowedPatterns = /[^1-9]?$/;

for (var i = 0; i < 80; i++) {
	document.getElementById('' + i).addEventListener('focus', function(e) {
		this.select();
	});
	document.getElementById('' + i).addEventListener('input', function(e) {
		this.value = this.value.replace(allowedPatterns, '');
	});
}

document.getElementById('80').addEventListener('input', function(e) {
	this.value = this.value.replace(allowedPatterns, '');
})