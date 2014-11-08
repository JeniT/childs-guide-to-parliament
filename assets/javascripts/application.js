var searchBaseUrl = "http://hansard.services.digiminster.com/members/contributions/list.json?startdate=2013-11-08&house=Commons&SearchTerm=";
var mpBaseUrl = "data/members/";

$('#hansardSearchForm').submit(
	function( event ) {
		var searchText = $('#hansardSearchText').val();
		var $searchResults = $('#hansardSearchResults');
		var $mpResults = $('#hansardMPs');
		$.getJSON( searchBaseUrl + searchText, function( data ) {
			var items = [];
			var mps = {};
			var mpItems = [];
			var $mpResultList = $("<ul />", { class: 'list-group' });

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
				$.getJSON(mpBaseUrl + val.mp + ".json", function ( mpData ) {
					$mpResultList.append("<li class='list-group-item'><span class='badge'>" + val.count + "</span><a target='_blank' href='http://www.parliament.uk/biographies/commons/" + mpData.slug + "/" + val.mp + "'>" + mpData.display_name + "</a></li>");
				});
			});

			$mpResults.html($mpResultList);
  	});
		event.preventDefault();
	}
);