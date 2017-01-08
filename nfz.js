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
const sass = function sass(maxEps, lastMaxEps) {
	rudeMsgs = [
		"Wow, more episodes - real ambitious.",
		"More episodes? That's one way to change your future.",
		"More episodes? You're better than this.",
		"There must be something better than another episode.",
		"More episodes? Don't do it. I believe in you."
	];
	niceMsgs = [
		"Fewer episodes? More love for you. <3",
		"Fewer episodes? Smart choice. Smart you.",
		"Fewer episodes! Welcome to the #noflixzone!",
		"That's right - take those episodes down!",
		"Great, fewer episodes! Keep building that focus!"
	];

	let sassCaption = document.getElementById('sassCaption');	
	if(maxEps > lastMaxEps) {
		debugMessage(['maxEps ', 'is being increased']);
		sassCaption.innerHTML = rudeMsgs[Math.floor(Math.random() * rudeMsgs.length)];
	} else if(maxEps < lastMaxEps) {
		debugMessage(['maxEps ', 'is being decreased']);
		sassCaption.innerHTML = niceMsgs[Math.floor(Math.random() * niceMsgs.length)];
	}
	
}

/*
 *  Watch for changes to the nfzBlock flag.
 *  Vary visibility of blocked/prompt divs.
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		debugMessage(['Received message from background.js']);
		if(request.greeting == 'BLOCK') {

			// Modify the popup
			debugMessage(['Blocked div appearing, Prompt div disappearing']);
			document.querySelector('.blocked').style.display = 'inline';
			document.querySelector('.prompt').style.display  = 'none';
			sendResponse({farewell: 1});
		}
});

/*
 *  Watch for changes in the maximum number of episodes dropdown.
 */
var lastMaxEps = 1;
document.addEventListener('DOMContentLoaded', function() {

	var options = document.querySelector('#maxEps');
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent('change', true, true);

	options.value = 1; // default value
	options.addEventListener('change', function(evt) {
		
		// Instruct the background script to modify its maxEps.
		let maxEps = evt.srcElement.value;
		chrome.runtime.sendMessage({greeting: maxEps}, function(response) {
			if(lastMaxEps != maxEps) {
				sass(maxEps, lastMaxEps);
				lastMaxEps = maxEps;
			}
		});

	}, false);

	options.dispatchEvent(evt);

});
