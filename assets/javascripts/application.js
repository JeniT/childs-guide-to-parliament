var searchBaseUrl = "http://hansard.services.digiminster.com/members/contributions/list.json?startdate=2013-11-08&house=Commons&SearchTerm=";

$('#hansardSearchForm').submit(
	function( event ) {
		var searchText = $('#hansardSearchText').val();
		var $searchResults = $('#hansardSearchResults');
		var $mpResults = $('#hansardMPs');
		$.getJSON( searchBaseUrl + searchText, function( data ) {
			var items = [];
			var mps = {};
			var mpItems = [];
			var mpList = [];
			$.each( data.Results, function( key, val ) {
				items.push( "<li class='list-group-item'>" + val.ContributionText + "</li>" );
				if (mps[val.MemberId] === undefined) {
					mps[val.MemberId] = { mp: val.MemberId, count: 1 };
				} else {
					mps[val.MemberId]['count']++;
				}
			});

			$searchResults.html($( "<ul />", {
				class: 'list-group',
			  html: items.join( "" )
			}));
			
			$.each(mps, function(key, val) {
				mpItems.push(val);
			});

			$.each(mpItems.sort(function(a,b) { return b.count - a.count }), function(key, val) {
				mpList.push("<li class='list-group-item'><span class='badge'>" + val.count + "</span>" + val.mp + "</li>");
			});

			$mpResults.html($( "<ul />", {
				class: 'list-group',
			  html: mpList.join( "" )
			}));
  	});
		event.preventDefault();
	}
);