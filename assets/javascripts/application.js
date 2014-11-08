var searchBaseUrl = "http://hansard.services.digiminster.com/members/contributions/list.json?startdate=2013-11-08&house=Commons&SearchTerm=";

$('#hansardSearchForm').submit(
	function( event ) {
		var searchText = $('#hansardSearchText').val();
		$.getJSON( searchBaseUrl + searchText, function( data ) {
			var items = [];
			$.each( data.Results, function( key, val ) {
			    items.push( "<li class='list-group-item'>" + val.ContributionText + "</li>" );
			  });
			 
			  $('#hansardSearchResults').html($( "<ul />", {
			  	class: 'list-group',
			    html: items.join( "" )
			  }));
  		});
		event.preventDefault();
	}
);