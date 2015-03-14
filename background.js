/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/scopes_background
*************************************************************************************/

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
    function set(key, value){
    	appAPI.db.async.set(
        key,
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
