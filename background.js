// watch all, or only the current, tab for a change in episode.

// ensure episodes are limited between Chrome windows
chrome.storage.sync.set({'nfzEps': 0}, function() {
	console.log("init");
	// pass
});

// grab value of trackID
function getParamByName(name, url) {
	if (!url)
      url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// detect changes in Netflix tabs
// sample URL: https://www.netflix.com/watch/70262656?trackId=14170287&tctx=0%2C0%2C156ca756-9cf3-43e6-a806-86166c5d44e6-56107319
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var nfzEps = 0;

	// take advantage of JS lazy evaluation
	if(tab.url.includes("netflix") && getParamByName("trackId", tab.url) != null) {
		chrome.storage.sync.get('nfzEps', function(result) {
			nfzEps = result;
			if(result > 1) {
				chrome.tabs.sendMessage(tabId, {}); // block
				console.log("we'd like to block");
			}
		});
		chrome.storage.sync.set({'nfzEps': nfzEps+1}, function() {
			console.log(getParamByName("trackId", tab.url
			console.log("just incr'd nfzEps");
			console.log(nfzEps+1);
		});
	}
});
