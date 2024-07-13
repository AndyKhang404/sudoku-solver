var index = 0;

document.getElementById('solve').addEventListener('click', function() {
	console.log(document.getElementById('cell-0').firstChild.value);
	document.getElementById('cell-80').firstChild.focus();
});

document.addEventListener('click', function(e) {
	let cellid = document.activeElement.parentElement.id;
	index = cellid.split('-')[1];
});

function numberKeypress(e){
	if (!(e.key >= 1 && e.key <= 9)) {
		return;
	}
}

document.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		document.getElementById('solve').click();
	} else if (e.key === 'Up') {
		document.getElementById('cell-80').firstChild.focus();
	} else if (e.key === 'Down') {
		document.getElementById('cell-0').firstChild.focus();
	} else if(e.key === 'Tab'){
	}
	else if (!(e.key >= 1 && e.key <= 9)) {
		e.preventDefault();
		e.stopPropagation();
		return;
	}
});