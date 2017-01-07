const DEBUG = 0;

const debugMessage = function debugMessage(msg) {
	let output = '';
	msg.forEach(function(e) {
		output += e;
	});
	console.log(output);
}

/*
 *  Watch for changes in the maximum number of episodes dropdown.
 */
document.addEventListener('DOMContentLoaded', function() {

	var options = document.querySelector('#maxEps');
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent('change', true, true);

	options.value = 1; // default value
	options.addEventListener('change', function(evt) {
		
		// Instruct the background script to modify its maxEps.
		chrome.runtime.sendMessage({greeting: evt.srcElement.value}, function(response) {
			debugMessage(['evt sent']);
		});

		debugMessage(['evt val: ', evt.srcElement.value]);
	}, false);

	options.dispatchEvent(evt);

});
