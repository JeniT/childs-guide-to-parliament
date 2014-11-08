var searchBaseUrl = "http://hansard.services.digiminster.com/members/contributions/list.json?startdate=2013-11-08&house=Commons&SearchTerm=";
var contributionBaseUrl = "http://hansard.services.digiminster.com/members/contributions/contribution/";
var mpBaseUrl = "data/members/";


var memberLink = function ( mp ) {
	return "<a href='members/" + mp.slug + ".html'>" + mp.display_name + "</a>";
};

var memberParty = function ( mp ) {
	return "<span class='label' style='background-color: " + mp.party_colour + ";'>" + mp.party_name + "</span>";
};

$('#hansardSearchForm').submit(
	function( event ) {
		var searchText = $('#hansardSearchText').val();
		var $searchResults = $('#hansardSearchResults');
		var $mpResults = $('#hansardMPs');
		$.getJSON( searchBaseUrl + searchText, function( data ) {
			var debates = {};
			var debateItems = [];
			var mps = {};
			var mpItems = [];
			var $searchResultList = $("<div class='panel-group' id='hansardAccordian' role='tablist' aria-multiselectable='true' />");
			var $mpResultTable = $("<table class='table' />");
			var $mpResultList = $("<div class='panel panel-default' />").append($mpResultTable);

			$.each( data.Results, function( key, val ) {
				if (debates[val.DebateSectionId] === undefined) {
					debates[val.DebateSectionId] = [val];
				} else {
					debates[val.DebateSectionId].push(val);
				}
				if (mps[val.MemberId] === undefined) {
					mps[val.MemberId] = { mp: val.MemberId, count: 1 };
				} else {
					mps[val.MemberId]['count']++;
				}
			});
			
			$.each(debates, function(key, val) {
				debateItems.push(val);
			});

			$.each(debateItems.sort(function(a,b) { return b.length - a.length }), function(key, val) {
				var $panel = $("<div class='panel panel-default' />");
				var $panelCollapse = $("<div id='debate-" + val[0].DebateSectionId + "-speeches' class='panel-collapse collapse' role='tabpanel' aria-labelledby='debate-" + val[0].DebateSectionId + "' />");
				var $table = $("<table class='table' />");
				$panel.append("<div class='panel-heading' role='tab', id='debate-" + val[0].DebateSectionId + "'><a data-toggle='collapse' data-parent='#hansardAccordian' href='#debate-" + val[0].DebateSectionId + "-speeches' aria-expanded='true' aria-controls='debate-" + val[0].DebateSectionId + "-speeches'><div>" + val[0].DebateSection + "<span class='badge pull-right'>" + val.length + "</span></div></a></div>");
				$.each(val, function(key, val) {
					var $row = $("<tr />");
					var $dateCell = $("<th class='hansardDate'>" + val.SittingDate.substr(0,10) + "</th>");
					var $mpCell = $("<td class='hansardMP' />");
					var $textCell = $("<td class='hansardText' />");
					$.getJSON(mpBaseUrl + val.MemberId + ".json", function (mpData) {
						$mpCell.html(memberLink(mpData) + "<br>" + memberParty(mpData));
					});
					$.getJSON(contributionBaseUrl + val.ContributionId + ".json", function ( contributionData ) {
						$textCell.html("<p class='contributionText'>" + contributionData[0].ContributionText + "</p><p><a target='_blank' href='http://membersdataportal.digiminster.com/Debates/Commons/" + contributionData[0].SittingDate.substr(0,10) + "/" + contributionData[0].DebateSectionId + "#contribution-" + contributionData[0].ContributionId + "'>Read more <span class='glyphicon glyphicon-new-window'></span></a></p>");
					});
					$row.append($dateCell);
					$row.append($mpCell);
					$row.append($textCell);
					$table.append($row);
				});
				$panelCollapse.append($table);
				$panel.append($panelCollapse);
				$searchResultList.append($panel);
			});

			$searchResults.html($searchResultList);
			
			$.each(mps, function(key, val) {
				mpItems.push(val);
			});

			$.each(mpItems.sort(function(a,b) { return b.count - a.count }), function(key, val) {
				var $row = $("<tr />");
				var $mpCell = $("<td class='hansardMP' />");
				var $partyCell = $("<td />");
				var $countCell = $("<td><span class='badge'>" + val.count + "</span></td>");
				$.getJSON(mpBaseUrl + val.mp + ".json", function ( mpData ) {
					$mpCell.html(memberLink(mpData));
					$partyCell.html(memberParty(mpData));
				});
				$row.append($mpCell);
				$row.append($partyCell);
				$row.append($countCell);
				$mpResultTable.append($row);
			});

			$mpResults.html($mpResultList);
  	});
		event.preventDefault();
	}
);
