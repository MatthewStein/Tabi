function addContext() {
  var obj = {};
  obj.title = 'Add link for later.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  obj.contexts = ["link"]
  obj.onclick = function(data){
    saveToStorage(data.linkUrl);
  }
  chrome.contextMenus.create(obj);
}
function saveToStorage(value) {
  var obj = {};
  obj.parentId = tabbyId;
  obj.url = value;
  obj.title = value;
  chrome.bookmarks.create(obj);
}
function removeFromStorage(key) { // it should be id so save[object].id
  chrome.bookmarks.remove(key);
  // guess why iam here
}
function saveAndCloseCurrent() {
  chrome.tabs.getSelected(null, function(tab){
    saveToStorage(tab.url);
    chrome.tabs.remove(tab.id);
  });
}/*
function adderUI(key, data) {
  $('#closed').append('<li><a href="'+ data +'">' + data + "</a><button onclick='removeFromStorage(" + key + ")'>remove</button></li>"); 
  // guess why iam here
}*//* 
function savedIterator() {
  for (var property in saved) {
    if (saved.hasOwnProperty(property)) {
      adderUI(property, saved[property]);
    }
  }
}*/
function retriveAllTabby() {
  chrome.bookmarks.getChildren(tabbyId, function(children) {
    children.forEach(function(bookmark) { 
      console.dir(bookmark);
      saved[bookmark.id] = bookmark;
    });
  });
}
function initializeBookmarksDB() {
  chrome.bookmarks.search("Tabby", function(data){
    if(!data.length>0){
      var obj = {};
      obj.parentId = '2';
      obj.url = null;
      obj.title = "Tabby"

      chrome.bookmarks.create(obj, function(data){
        tabbyId = data.id;
      });

    } else {
      tabbyId = data[0].id;
      retriveAllTabby();
    }
  })
}
addContext();
var tabbyId;
var saved = {};
initializeBookmarksDB();

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'save-and-close') {
    saveAndCloseCurrent();
  }
});
