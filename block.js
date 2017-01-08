//chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
chrome.runtime.onMessage.addListener(
	function(request, sender) {

		if(request.action == 'block_page') {
			console.log("Blocking page now.");
			console.log("videos" + document.getElementsByTagName('video'));
			console.log("videos found: " + document.getElementsByTagName('video').length);

			if(document.getElementsByTagName('video').length > 0) {
				console.log('Deleting video');
				document.getElementsByTagName('video')[0].pause();	// pause video, TODO: click netflix pause, not pause video tag
				/*
				let vid = document.getElementsByTagName('video')[0];
				vid.parentElement.removeChild(vid);
				console.log('Deleting video');
				*/
			}

			document.body.innerHTML +=
			`
			<html>
			<div class="nfz-overlay">
				<div class="nfz-overlay-content">
					<h1>You know better.</h1>
					<hr>
					<h2>No more episodes until</h2>
					<span id="nfz-deadline">tomorrow at 5:20pm.</span>
				</div>
			</div>
			</html>
			`;
		}
});
