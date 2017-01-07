const DEBUG = 1;
var MAX_EPS = 1;

/*
 *  Output a message to the console.
 */
const debugMessage = function debugMessage(caller, msg) {
	if(DEBUG) {
		var output = caller;
		output += ": ";
		msg.forEach(function(e) {
			output += e;
		});
		console.log(output);
	}
};

/*
 *  Asks content script to block the current page.
 */
const blockPage = function blockPage(tabId) {
	chrome.tabs.sendMessage(tabId, {action: 'block_page'}, function(response) {
		debugMessage('blockPage()', ['content script returned successfully']);
	});
};

/*
 *  Increments the number of episodes watched so far.
 */
const incrementEps = function incrementEps(callback) {
	chrome.storage.sync.get('nfzEps', function(nfzObj) {
		let nfzEps = nfzObj['nfzEps']+1;
		chrome.storage.sync.set({'nfzEps': nfzEps}, function(response) {
			debugMessage('getEpsWatched()', ['successfully incremented nfzEps with value ', nfzEps]);
			callback(nfzEps);
		});
	});
};

/*
 *  Grabs the trackId of the current URL.
 *  Credits to David Walsh (https://davidwalsh.name)
 */
const getTrackId = function getTrackId(url) {
	//name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + 'trackId' + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/*
 *  Watch all tabs for netflix. Should be called whenever tabs are updated.
 *  TODO: find a workaround for tabs[0], since currentWindow never seems to be true?
 *  TODO: make sure netflix is only part of the domain, not the path
 *  TODO: find a way around 'active: true', for background instances of Netflix - just if url matches?
 */
const pollTabs = function pollTabs(callback) {
	chrome.tabs.query({active: true}, function(tabs) {
		 callback(tabs[0].url.indexOf('netflix') > -1);
	});
};

/*
 *  Classify a video as watched.
 *  TODO: add time elapsing condition
 * 	TODO: clear Storage Area on extension leaving
 */
const isWatched = function isWatched(trackId, callback) {
	var result = 0;	
	chrome.storage.sync.get('nfzTrackId', function(response) {
		if(response['nfzTrackId'] != trackId) {
			chrome.storage.sync.set({'nfzTrackId': trackId}, function() {		// StorageArea functions are asynchronous, so everything should be done in the callback
				debugMessage('isWatched()', ['found a new episode being currently watched.']);
				callback(1);
			});
		} else {
			callback(0);
		}
	});
};

/*
 *  Initialize values in Storage Area.
 */
chrome.storage.sync.set({'nfzEps': 0}, function(response) {
	debugMessage('main', ['nfzEps was successfully initialized.']);
});
chrome.storage.sync.set({'nfzTrackId': 0}, function(response) {
	debugMessage('main', ['nfzTrackId was successfully initialized.']);
});

/*
 *  Watch for updates to maxEps.
 */
chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.greeting != null && request.greeting != MAX_EPS)
		MAX_EPS = request.greeting;
	debugMessage('onMsg', ['updated MAX_EPS to ', MAX_EPS]);
});

/*
 *  Watch for changes in any tabs, so we can look out for Netflix instances in background tabs too.
 *  TODO: stop asynchronous calls from repeating on tab updates
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	debugMessage('main', ['listener has been invoked.']);

	// Determine if queried tab has Netflix open
	pollTabs(function(isNetflix) {
		if(isNetflix) {

			// Determine if an episode has just been watched.
			isWatched(getTrackId(tab.url), function(response) {
				if(response) {

					// Check if the max number of episodes has been watched.
					incrementEps(function(nfzEps) {
						if(nfzEps > MAX_EPS) {
							blockPage(tabId);
						}
					});		
				}
			});
		}
	});
});
