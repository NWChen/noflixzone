/*
 *  Asks content script to block the current page.
 */
const blockPage = function blockPage(tabId) {
	chrome.tabs.sendMessage(tabId, {action: 'block_page'}, function(response) {
		console.log("Content script returned successfully with response: " + response);
	});
}

/*
 *  Gets the number of episodes watched so far.
 */
const getEpsWatched = function getEpsWatched() {
	chrome.storage.sync.get('nfzEps', function(response) {
		if(response['nfzEps']) {
			console.log("nfzEps retrieved successfully with value: " + response['nfzEps']);
			return response['nfzEps'];
		}
		return null;
	});
}

/*
 *  Gets the trackId of the last video watched.
 */
const getLastEp = function getLastEp() {
	chrome.storage.sync.get('nfzLastEp', function(response) {
		if(response['nfzLastEp']) {
			console.log("nfzLastEp retrieved successfully with value: " + response['nfzLastEp']);
			return response['nfzLastEp'];
		}	
		return null;
	});
}

/*
 *  Grabs the trackId of the current URL.
 *  Credits to David Walsh (https://davidwalsh.name).
 */
const getTrackId = function getTrackId(url) {
	//name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + 'trackId' + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/*
 *  Watch all tabs for netflix. Should be called whenever tabs are updated.
 *  TODO: find a workaround for tabs[0], since currentWindow never seems to be true?
 *  TODO: make sure netflix is only part of the domain, not the path
 *  TODO: find a way around 'active: true', for background instances of Netflix
 */
const watchTabs = function watchTabs() {
	chrome.tabs.query({active: true}, function(tabs) {
		if(tabs[0].url.indexOf('netflix') > -1) {
			return true;
		}
		return false;
	});
}

/*
 *  Classify a video as watched.
 *  TODO: add time elapsing condition
 * 	TODO: clear Storage on extension leaving
 */
const isWatched = function isWatched(trackId) {
	var watched = false;
	chrome.storage.sync.get('nfzTrackId', function(trackObj) {
		if(trackObj['nfzTrackId'] != trackId) {
			chrome.storage.sync.set({'nfzTrackId': trackId});	// Reset current trackId
			console.log('isWatched() found a new episode being currently watched.');
			return true;
		}
		console.log('isWatched() did not find a new episode being currently watched.');
		return false;
	});
}

// Initialize values in Storage Area.
chrome.storage.sync.set({'nfzEps': 0}, function(response) {
	console.log('nfzEps was successfully initialized.');
});
chrome.storage.sync.set({'nfzTrackId': 0}, function(response) {
	console.log('nfzTrackId was successfully initialized.');
});


// Watch for changes in any tabs, so we can look out for Netflix instances in background tabs too.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// JS lazy evaluation
	//if(watchTabs && isWatched(getTrackId(tab.url))) {
	if(watchTabs) {
		if(isWatched(getTrackId(tab.url)))
		// ...block if necessary...	
			console.log("New episode!");	
	}
});
