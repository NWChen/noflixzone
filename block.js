//chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
chrome.runtime.onMessage.addListener(
	function(request, sender) {
		console.log("Blocking page now.");
		if(request.action=='block_page') {
			document.getElementByTagName('video')[0].pause();	// pause the video
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
			`;
		}
});
