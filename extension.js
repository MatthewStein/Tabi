  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/

appAPI.ready(function($) {
	appAPI.shortcut.add('CTRL+SHIFT+O', function (event) { 
		var URL = $(location).attr('href');
		console.log(URL);
		$('#closed').append(URL);
		appAPI.message.toPopup({
			type: 'add-url',
			url: URL
		})
	}, {type: 'keydown'});
	
});