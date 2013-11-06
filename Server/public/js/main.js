function parseTotals(totals) {
	if (totals.left) {
		$('.machine.left span').html(totals.left);
	}
	if (totals.right) {
		$('.machine.right span').html(totals.right);
	}
}

$(document).ready(function() {
	$.getJSON('/totals',function(totals) {
		if (totals) {
			parseTotals(totals);
		}
	});

	this.socket = io.connect('http://localhost:8080');
	this.socket.on('totals',function(totals) {
		parseTotals(totals);
	});
});