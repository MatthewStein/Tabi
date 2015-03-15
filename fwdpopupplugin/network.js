function addContext() {
  var obj = {};
  obj.title = 'Add link for later.';
  obj.contexts = ["link"]
  obj.onclick = function(data){
    saveToStorage(data.linkUrl);
  }
  chrome.contextMenus.create(obj);
}
function saveToStorage(value) {
  var obj = {};
  obj.parentId = tabiId;
  obj.url = value;
  obj.title = value;
  chrome.bookmarks.create(obj);
}
function removeFromStorage(key) { // it should be id so save[object].id
  chrome.bookmarks.remove(key);
}
function saveAndCloseCurrent() {
  chrome.tabs.getSelected(null, function(tab){
    saveToStorage(tab.url);
    chrome.tabs.remove(tab.id);
  });
}
//function adderUI(key, data) {
//  $('#closed').append('<li><a href="'+ data +'">' + data + "</a><button onclick='removeFromStorage(" + key + ")'>remove</button></li>");
//}
//function savedIterator() {
//  for (var property in saved) {
//    if (saved.hasOwnProperty(property)) {
//      adderUI(property, saved[property]);
//    }
//  }
//}
function retrieveAllTabi() {
  chrome.bookmarks.getChildren(tabiId, function(children) {
    children.forEach(function(bookmark) { 
      console.dir(bookmark);
      window.saved[bookmark.id] = bookmark;
      window.append("gooby");
      window.append("dooby");
    });
  });
}
function initializeBookmarksDB() {
  chrome.bookmarks.search("Tabi", function(data){
    if(!data.length>0){
      var obj = {};
      obj.parentId = '2';
      obj.url = null;
      obj.title = "Tabi"

      chrome.bookmarks.create(obj, function(data){
        tabiId = data.id;
      });

    } else {
      tabiId = data[0].id;
      retrieveAllTabi();
    }
  })
}
addContext();
var tabiId;
window.saved = ["facebook", "google", "amazon", "reddit", "tumblr", "pinterest", "venmo"];
initializeBookmarksDB();

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'save-and-close') {
    saveAndCloseCurrent();
  }
});

// chrome.runtime.onConnect.addListener(function(port){
//   port.postMessage({"hello", "goodbye", "good evening"});
// });


////////////////

var w = 500, h = 400;
var labelDistance = 0;

var vis = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);

var nodes = [];
var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];
// var port = chrome.runtime.connect({name:"background.js"});
// port.onMessage.addListener(function(message,sender){
//   console.log(message);
// });

for(var i = 0; i < window.saved.length; i++) {
	var node = {
		label : window.saved[i]
	};
	nodes.push(node);
	labelAnchors.push({
		node : node
	});
	labelAnchors.push({
		node : node
	});
};

for(var i = 0; i < nodes.length; i++) {
	for(var j = 0; j < i; j++) {
		if(Math.random() > .60)
			links.push({
				source : i,
				target : j,
				weight : Math.random()
			});
	}
	labelAnchorLinks.push({
		source : i * 2,
		target : i * 2 + 1,
		weight : 1
	});
};
var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
	return x.weight * 10
});
force.start();

var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
force2.start();

var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 3);
node.call(force.drag);


var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
	anchorNode.append("svg:text").text(function(d, i) {
	return i % 2 == 0 ? "" : d.node.label
}).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

var updateLink = function() {
	this.attr("x1", function(d) {
		return d.source.x;
	}).attr("y1", function(d) {
		return d.source.y;
	}).attr("x2", function(d) {
		return d.target.x;
	}).attr("y2", function(d) {
		return d.target.y;
	});

}

var updateNode = function() {
	this.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	});

}


force.on("tick", function() {
	force2.start();
	node.call(updateNode);
	anchorNode.each(function(d, i) {
		if(i % 2 == 0) {
			d.x = d.node.x;
			d.y = d.node.y;
		} else {
			var b = this.childNodes[1].getBBox();

			var diffX = d.x - d.node.x;
			var diffY = d.y - d.node.y;

			var dist = Math.sqrt(diffX * diffX + diffY * diffY);

			var shiftX = b.width * (diffX - dist) / (dist * 2);
			shiftX = Math.max(-b.width, Math.min(0, shiftX));
			var shiftY = 5;
			this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
		}
	});
	anchorNode.call(updateNode);

	link.call(updateLink);
	anchorLink.call(updateLink);

});