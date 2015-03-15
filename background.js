/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/scopes_background
*************************************************************************************/

<<<<<<< HEAD
appAPI.ready(function() {
	
	var closedTabs = "testtesttest";
	
	var popupDims = {
		CH: {height: 280, width: 400},
		FF: {height: 280, width: 400},
		IE: {height: 280, width: 400},
		SF: {height: 280, width: 400}
	};
    // Sets the badge text and background color
    appAPI.browserAction.setResourceIcon('logo.png');
	
	if ("CHFFIESF".indexOf(appAPI.platform) !== -1) {
		appAPI.browserAction.setPopup({
			resourcePath:'popup.html',
			height:popupDims[appAPI.platform].height,
			width:popupDims[appAPI.platform].width
		});
	}
	else {
		alert('This extension is not supported on your browser');
	}
	
	appAPI.message.addListener(function(msg) {
		if (msg.type === 'close-current-tab') {
			console.log('message received');
			// var id = appAPI.getTabId();
			// console.log(id);
			// appAPI.tabs.closeTab(id);
			$('#closed').append(msg.url);
		}
	});
  
appAPI.ready(function($) {

	// Place your code here (ideal for handling browser button, global timers, etc.)
		var ulrs = {};
	appAPI.db.async.getKeys(function(arrayOfKeys) {
		var lastKey = arrayOfKeys.length;
	});
	appAPI.db.async.getList(function(arrayOfItems) {
        // Process the result
        for (var i = 0; i < lastKey; i++) {
        	ulrs[arrayOfItems[i].key] = arrayOfItems[i].value;
        }
    });
	function key(){
		var l = lasyKey;
		lastKey++;
		return l;
	}
    function set(value){
    	appAPI.db.async.set(
        key(),
        value,
        appAPI.time.yearsFromNow(10),
        function() {
            console.log("Successfully saved key-value pair to the local database");
        });	
    }
    function remove(key){
    	appAPI.db.async.remove(
        key,
        function() {
            console.log("Successfully removed");
        });	
    }
    appAPI.contextMenu.add("addForLater", "Add later", function (linkUrl ) {
        set(key(),linkUrl); 
    }, ["link"]);
});
