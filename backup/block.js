const blockScreen = function blockScreen() {
	console.log("blocking screen");
	// full screen overlay
	document.body.innerHTML +=
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
	;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//document.getElementByTagName('video')[0].pause(); // pause video player
	console.log(document.getElementByTagName('video'));
	blockScreen();	
});
