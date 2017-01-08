// watch all, or only the current, tab for a change in episode.

// ensure episodes are limited between Chrome windows
chrome.storage.sync.set({'nfzEps': 0}, function() {
	console.log("init");
});

// default nfzEps
let day = new Date().getDay();
chrome.storage.sync.set({'nfzDay': day}, function() {
	console.log("date stored");
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

// sample URL: https://www.netflix.com/watch/70262656?trackId=14170287&tctx=0%2C0%2C156ca756-9cf3-43e6-a806-86166c5d44e6-56107319
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var nfzEps = 0;

	// clear nfzEps in Storage Area
	let currentDay = new Date().getDay();
	chrome.storage.sync.get('nfzEps', function(result) {
		//if(result['nfzDay'] != currentDay) 
		//	console.log("error");
	});

	// watch tabs, even if they're not active
	// changeInfo.url != null? ensure page reloads aren't counted as episode watches
	if(tab.url.includes("netflix") && getParamByName("trackId", tab.url) != null) {
		chrome.storage.sync.get('nfzEps', function(result) {
			nfzEps = result['nfzEps'];

			// maximum number of episodes watched - start blocking
			if(tab['status']=='complete' && nfzEps > 1) { // ensure tab has finished loading
				console.log("we'd like to block. tab with id:");
				console.log(tabId);
				chrome.tabs.sendMessage(tabId, {foo:'bar'}, function(response) {
					//console.log("received response from content script");
				});
			}

			nfzEps += 1;
			console.log(nfzEps);
			chrome.storage.sync.set({'nfzEps': nfzEps}, function() { // storage calls are asynchronous
			});
		});
	}
});
