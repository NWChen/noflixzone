function load_screen() {
	document.body.innerHTML +=
	// Full screen overlay
	`
	<div class="nfz-overlay">
		<div class="nfz-overlay-content">
			<h1>You know better.</h1>
			<h2>No more episodes until tomorrow.</h2>
		</div>
	</div>
	`	
}

window.onload = function() {
	alert("detected");
	load_screen();
};
