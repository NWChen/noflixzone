function load_screen() {
	document.body.innerHTML =
	`
	<html>
		<link rel="styles.css"></link>
		<h1>You know better.</h1>
	</html>
	`	
}

window.onload = function() {
	alert("detected");
	load_screen();
};
