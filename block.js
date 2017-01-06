function blockScreen() {
	document.body.innerHTML +=
	// Full screen overlay
	`
	<div class="nfz-overlay">
		<div class="nfz-overlay-content">
			<h1>You know better.</h1>
			<hr>
			<h2>No more episodes until</h2>
			<span id="nfz-deadline">tomorrow at 5:20pm.</span>
		</div>
		</div>
	`	
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
	blockScreen();
	document.getElementByTagName('video').pause(); // pause video player
});
