const DEBUG = 0;

const debugMessage = function debugMessage(msg) {
	let output = '';
	msg.forEach(function(e) {
		output += e;
	});
	console.log(output);
}

/*
 *  Mouth off to the user.
 *  TODO: customize sass based on how many episodes are being incr/decremented
 */
const sass = function sass(maxEps) {
	rudeMsgs = [
		"Wow, more episodes - real ambitious.",
		"That's one way to change your future.",
		"You're better than this."
		"There must be something better than another episode."
		"Don't do it. I believe in you."
	]
	niceMsgs = [
		"Fewer episodes? More love for you. <3",
		"Smart choice. Smart you.",
		"Welcome to the #noflixzone!",
		"That's right - take those episodes down!",
		"Good choice. Keep building that focus!"
	]
	
	if(maxEps > lastMaxEps) {
		// TODO: push random from rudeMsgs to popup
	} else if(maxEps < lastMaxEps) {
		// TODO: push random from niceMsgs to popup
	}
	
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
