// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$(function() {
    $( "#tabs" ).tabs();
  });

$(function() {
 $(".stored_tab").click(function() {
   removeFromStorage($(this).attr("id"));
 });
});

// Search the bookmarks when entering the search keyword.
$(function() {
 var lastKey;
 var saved;
 initializeKey();

 $('#search').change(function() {
    $('#bookmarks').empty();
    dumpBookmarks($('#search').val());
 });
 $('#cat_button').click(function() {
     saveAndCloseCurrent();
   })
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
 var bookmarkTreeNodes = chrome.bookmarks.getTree(
   function(bookmarkTreeNodes) {
     $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
   });
}
function dumpTreeNodes(bookmarkNodes, query) {
 var list = $('<ul>');
 var i;
 for (i = 0; i < bookmarkNodes.length; i++) {
   list.append(dumpNode(bookmarkNodes[i], query));
 }
 return list;
}
function dumpNode(bookmarkNode, query) {
 if (bookmarkNode.title) {
   if (query && !bookmarkNode.children) {
     if (String(bookmarkNode.title).indexOf(query) == -1) {
       return $('<span></span>');
     }
   }
   var anchor = $('<a>');
   anchor.attr('href', bookmarkNode.url);
   anchor.text(bookmarkNode.title);
   /*
    * When clicking on a bookmark in the extension, a new tab is fired with
    * the bookmark url.
    */
   anchor.click(function() {
     chrome.tabs.create({url: bookmarkNode.url});
   });
   var span = $('<span>');
   var options = bookmarkNode.children ?
     $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
     $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
       'href="#">Delete</a>]</span>');
   var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
     '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
     '</td></tr></table>') : $('<input>');
   // Show add and edit links when hover over.
       span.hover(function() {
       span.append(options);
       $('#deletelink').click(function() {
         $('#deletedialog').empty().dialog({
                autoOpen: false,
                title: 'Confirm Deletion',
                resizable: false,
                height: 140,
                modal: true,
                overlay: {
                  backgroundColor: '#000',
                  opacity: 0.5
                },
                buttons: {
                  'Yes, Delete It!': function() {
                     chrome.bookmarks.remove(String(bookmarkNode.id));
                     span.parent().remove();
                     $(this).dialog('destroy');
                   },
                   Cancel: function() {
                     $(this).dialog('destroy');
                   }
                }
              }).dialog('open');
        });
       $('#addlink').click(function() {
         $('#adddialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Add New Bookmark', modal: true,
           buttons: {
           'Add' : function() {
              chrome.bookmarks.create({parentId: bookmarkNode.id,
                title: $('#title').val(), url: $('#url').val()});
              $('#bookmarks').empty();
              $(this).dialog('destroy');
              window.dumpBookmarks();
            },
           'Cancel': function() {
              $(this).dialog('destroy');
           }
         }}).dialog('open');
       });
       $('#editlink').click(function() {
        edit.val(anchor.text());
        $('#editdialog').empty().append(edit).dialog({autoOpen: false,
          closeOnEscape: true, title: 'Edit Title', modal: true,
          show: 'slide', buttons: {
             'Save': function() {
                chrome.bookmarks.update(String(bookmarkNode.id), {
                  title: edit.val()
                });
                anchor.text(edit.val());
                options.show();
                $(this).dialog('destroy');
             },
            'Cancel': function() {
                $(this).dialog('destroy');
            }
        }}).dialog('open');
       });
       options.fadeIn();
     },
     // unhover
     function() {
       options.remove();
     }).append(anchor);
 }
 var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
 if (bookmarkNode.children && bookmarkNode.children.length > 0) {
   li.append(dumpTreeNodes(bookmarkNode.children, query));
 }
 return li;
}
function saveToStorage(value) {
 var obj = {};
 obj[getKeyForSave()] = value;
 chrome.storage.local.set(obj, function() {
   // Notify that we saved.
   message('added');
 });
}
function removeFromStorage(key) {
 chrome.storage.local.remove(key, function() {
   // Notify that we saved.
   message('removed');
 });
}
function getKeyForSave() {
 lastKey++;
 return lastKey;
}
function initializeKey() {
 chrome.storage.local.get(null, function(items) {
   lastKey = Object.keys(items).length;
   saved = items;
   savedIterator();
 });
}
function saveAndCloseCurrent(){
 chrome.tabs.getSelected(null, function(tab){
   saveToStorage(tab.url);
   chrome.tabs.remove(tab.id);
 });
}
function adderUI(key, data) {
//  var url = $('data[rel="shortcut icon"]')[0].href;
 $('#closed').append('<li><a href="' + data + '" target="_blank" class="stored_tab" id="' + key + '">' + data + "</a></li>");
//  console.log(url);
//    $('#closed').append('<img src="' + url + '">');
}

function savedIterator() {
 for (var property in saved) {
   if (saved.hasOwnProperty(property)) {
     adderUI(property, saved[property]);
   }
 }
}

document.addEventListener('DOMContentLoaded', function () {
 dumpBookmarks();
});