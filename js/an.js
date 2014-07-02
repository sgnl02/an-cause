	var AN = (function () {

		// Makes a loading bar below the header
		var loading = function(number) {
			var number = number;	//0-100

			if(number === 0 || number === 100) {
				window.setTimeout(function () {	
					document.querySelector('progress').value = 0;

					// Hides loading bar if not needed
					if(number === 0) {
						document.querySelector('progress').className = 'fade-in';
					}

					if(number === 100) {
						document.querySelector('progress').className = 'fade-out';
					}
				}, 1000);

			}

			document.querySelector('progress').value = number;
		}

		// Retrieves the json-file, or shows an error-message and shows
		// the offine localStorage-data instead
		var getData = function (time) {
			var time = time || 0	//Otherwise, set to 0
			, xhr = new XMLHttpRequest({mozSystem: true});	// Cross-origin
			//var xhr = new XMLHttpRequest();
	
			xhr.open('GET', 'data.json', true);
			xhr.timeout = 5750;
			xhr.addEventListener('load', function(event) {
	    	if (xhr.status >= 200 && xhr.status < 304) {
					 window.setTimeout(function () {
						// Clears list and localStorage to refill with contents
						// of the json-file		
						document.getElementById('hookListItems').innerHTML='';
						localStorage.clear();

						loading(50);	
				   	storeData(time, JSON.parse(xhr.responseText));

					 }, time);
				} else {
					// Shows localStorage-data and error-message, when user is offline
					createList(time);

					utils.status.show('Offline.');    
				}
			});
	
			xhr.send(null);
		}
	
		// Stores the json-data in localStorage, for offline use
		var storeData = function(time, items) {
			if(0 < time) {
				loading(75);
			}

			for(var key in items) {
				localStorage.setItem(key, JSON.stringify(items[key]));
			}
	
			createList(time);
		}
	
		// Creates the list from the localStorage
		var createList = function(time) {	
			var totalListItems = localStorage.length
			, listItems = ''
			, news = ''
			, appendListItems = document.getElementById('hookListItems')
			, localStorageOrdered = new Array();

			loading(100);

			// Looping over localStorage items for sorting to get the items
			// in order, because:
			//
			// ECMAScript specification. In ECMA-262, section 12.6.4:
			// 
			// The mechanics of enumerating the properties ... is implementation dependent.			
			for (i=0;i<localStorage.length;i++){
				localStorageOrdered[i] = localStorage.getItem(localStorage.key(i));
			}

			var localStorageOrdered = localStorageOrdered.sort();

			for (var i=0; i<totalListItems; i++) {
				news = JSON.parse(localStorageOrdered[i])
			
				listItems += '<li><a href="#" id="listItem'
					+ i
					+ '"><p>'
					+ news.title
					+ '</p></a></li>';
			}
	
			document.getElementById('hookListItems').innerHTML='';
			appendListItems.insertAdjacentHTML('beforeend', listItems);
		}
	
		// Show the selected item in the list
		var selectListItem = (function () {
			function getListItemId(event) {
				var listItemId = event.target.parentNode.id
				, localStorageId = listItemId.match(/\d+$/)[0]
				, newsItem = JSON.parse(localStorage.getItem(localStorageId));

				document.getElementById('hookNewsTitle').innerHTML = newsItem.title;
				document.getElementById('hookNewsItem').innerHTML = newsItem.body;

				// Share something via Twitter
				document.querySelector('#share-twitter').addEventListener ('click', function () {
					var link = (
						'I shared'
						+ ' "' + newsItem.title + '" '
						+ 'from AN Cause'
					);	

					window.open('https://twitter.com/home?status=' + link, '_blank');
				});
	
				// If the share-button is clicked, show action-menu
				document.querySelector('#action-share').addEventListener ('click', function () {
				  document.querySelector('#share-menu').className = 'fade-in';
				});

				// Cancel button for the action-menu
				document.querySelector('#share-menu-cancel').addEventListener ('click', function () {
				  document.querySelector('#share-menu').className = 'fade-out';
				});
	
				document.querySelector('#' + listItemId).addEventListener ('click', function () {
					document.querySelector('#newsList').className = 'current';
	  				document.querySelector('[data-position="current"]').className = 'left';
				});
	
				// Back to the listitems
				document.querySelector('#backToListAlerts').addEventListener ('click', function () { 
					// Replacing content between tags is a pain in the butt:
					// http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/
	
					// Emptying items on back-button
					document.getElementById('hookNewsTitle').innerHTML = '';
					document.getElementById('hookNewsItem').innerHTML = '';

					document.querySelector('#newsList').className = 'right';
	  				document.querySelector('[data-position="current"]').className = 'current';	
				});
	
				// Send email-function
				document.querySelector('#hookTakeAction').addEventListener ('click', function () {
						function sendEmail(toEmail, subject, body) {
						  var createEmail = new MozActivity({
						    name : "new",
						    data : {
						      type : "mail",
						      url : "mailto:" + toEmail + "?&subject=" + subject + "&body=" + body + "",
						    }
						  });
						}
	
					sendEmail(newsItem.email_to, newsItem.title, newsItem.body);
				});
			}
	
			var element = document.getElementById('hookListItems');
			element.addEventListener("click", getListItemId, true);
		})();

		// Settings buttons
		var storeEmail = function () {
			storeEmailValue = document.querySelector('#storeEmail').value;
			storeEmailValue.trim();
	
			if(storeEmailValue.length === 0) {
			} else {	
				localStorage.setItem("email", storeEmailValue);
	
				utils.status.show('Saved.');    
			}
		}
	
		// Listeners for the navigationbuttons
		var navbuttons = (function () {
			document.querySelector('#sidebar-donate').addEventListener ('click', function () {
				document.querySelector('#donate').className = 'current';
	  			document.querySelector('[data-position="current"]').className = 'left';
			});
	
			document.querySelector('#backToListDonate').addEventListener ('click', function () { 
				document.querySelector('#donate').className = 'right';
	  			document.querySelector('[data-position="current"]').className = 'current';
			});
	
			document.querySelector('#sidebar-about').addEventListener ('click', function () {
				document.querySelector('#about').className = 'current';
	  			document.querySelector('[data-position="current"]').className = 'left';
			});
	
			document.querySelector('#backToListAbout').addEventListener ('click', function () { 
				document.querySelector('#about').className = 'right';
	  			document.querySelector('[data-position="current"]').className = 'current';
			});
	
			document.querySelector('#sidebar-settings').addEventListener ('click', function () {
				document.querySelector('#settings').className = 'current';
	  			document.querySelector('[data-position="current"]').className = 'left';
			});
			
			document.querySelector('#backToListSettings').addEventListener ('click', function () { 
				document.querySelector('#settings').className = 'right';
	  			document.querySelector('[data-position="current"]').className = 'current';	
	
					storeEmail();
			});
	
			document.querySelector('#okBackToListSettings').addEventListener ('click', function () { 
				document.querySelector('#settings').className = 'right';
	  			document.querySelector('[data-position="current"]').className = 'current';
	
					storeEmail();
			});

			document.querySelector('#updateList').addEventListener ('click', function () {
				loading(0);
	
				window.setTimeout(function () {
					getData(1000);
				}, 5000);
			});
		})();
	
		// Executes retrieving the json-data, or reads from localStorage
		if(localStorage.length === 0) {
			getData();
		} else {
			createList();
		}	

	})();
