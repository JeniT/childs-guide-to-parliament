var searchBaseUrl = "http://hansard.services.digiminster.com/members/contributions/list.json?startdate=2013-11-08";
var contributionBaseUrl = "http://hansard.services.digiminster.com/members/contributions/contribution/";
var mpBaseUrl = "data/members/";


var memberLink = function ( mp ) {
	return "<a href='members/" + mp.slug + ".html'>" + mp.display_name + "</a>";
};

var memberParty = function ( mp ) {
	return "<span class='label " + mp.party_slug + "-bg'>" + mp.party_name + "</span>";
};

var memberIcon = function(d) { 
	var img = '';
	if (d.house_slug === 'commons') {
		img = d.gender + '_mp';
	} else {
		img = d.gender === 'male' ? 'lord' : 'baroness';
	}
	return "<a href='members/" + d.slug + ".html' title='" + d.display_name + "'><img class='img-circle " + d.party_slug + "-bg' height='32px' src='assets/images/" + img + "/" + img + ".png'></a>"; 
};

var searchHouse = $('#hansardSearchHouse').val();

$('#hansardSearchForm').submit(
	function( event ) {
		var searchText = $('#hansardSearchText').val();
		var $searchResults = $('#hansardSearchResults');
		var $mpResults = $('#hansardMPs');
		var mpsOrLords = searchHouse === 'commons' ? 'MPs' : 'Lords';
		var capsSearchHouse = searchHouse.charAt(0).toUpperCase() + searchHouse.slice(1);
		var searchUrl = searchBaseUrl + "&house=" + capsSearchHouse + "&SearchTerm=" + searchText;

		$searchResults.html("<h4>Debates about " + searchText + "</h4>");
		$mpResults.html("<h4>" + mpsOrLords + " talking about " + searchText + "</h4>");

		$.getJSON('data/members/all.json', function ( mpDatas ) {

			$.getJSON(searchUrl, function( data ) {
				var debates = {};
				var debateItems = [];
				var mps = {};
				var mpItems = [];
				var $searchResultList = $("<div class='panel-group' id='hansardAccordian' role='tablist' aria-multiselectable='true' />");
				var $mpResultTable = $("<table class='table' />");
				var $mpResultList = $("<div class='panel panel-default' />").append($mpResultTable);

				$.each( data.Results.sort(function(a,b) { return a.ContributionId - b.ContributionId }), function( key, val ) {
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
					var date = new Date(val[0].SittingDate);

					$panel.append("<div class='panel-heading' role='tab', id='debate-" + val[0].DebateSectionId + "'><a data-toggle='collapse' data-parent='#hansardAccordian' href='#debate-" + val[0].DebateSectionId + "-speeches' aria-expanded='true' aria-controls='debate-" + val[0].DebateSectionId + "-speeches'><div>" + date.toLocaleDateString() + " " + val[0].DebateSection + "<span class='badge pull-right'>" + val.length + "</span></div></a></div>");

					$.each(val, function(key, val) {
						var $row = $("<tr />");
						var $mpCell = $("<td class='hansardMP' />");
						var $textCell = $("<td class='hansardText' />");

						var mpData = mpDatas[val.MemberId];
						$mpCell.html(memberLink(mpData) + "<br>" + memberParty(mpData));

						$.getJSON(contributionBaseUrl + val.ContributionId + ".json", function ( contributionData ) {
							$textCell.html("<p class='contributionText'>" + contributionData[0].ContributionText + "</p><p><a target='_blank' href='http://membersdataportal.digiminster.com/Debates/Commons/" + contributionData[0].SittingDate.substr(0,10) + "/" + contributionData[0].DebateSectionId + "#contribution-" + contributionData[0].ContributionId + "'>Read more <span class='glyphicon glyphicon-new-window'></span></a></p>");
						});

						$row.append($mpCell);
						$row.append($textCell);
						$table.append($row);
					});

					$panelCollapse.append($table);
					$panel.append($panelCollapse);
					$searchResultList.append($panel);
				});

				$searchResults.append($searchResultList);
				
				$.each(mps, function(key, val) {
					mpItems.push(val);
				});

				$.each(mpItems.sort(function(a,b) { return b.count - a.count }), function(key, val) {
					var $row = $("<tr />");
					var $mpCell = $("<td class='hansardMP' />");
					var $partyCell = $("<td />");
					var $countCell = $("<td><span class='badge'>" + val.count + "</span></td>");

					var mpData = mpDatas[val.mp];
					$mpCell.html(memberLink(mpData));
					$partyCell.html(memberParty(mpData));

					$row.append($mpCell);
					$row.append($partyCell);
					$row.append($countCell);
					$mpResultTable.append($row);
				});

				$mpResults.append($mpResultList);
	  	});

		});

		event.preventDefault();
	}
);

$(document).ready(function () {

	$.getJSON('data/members/all.json', function (data) {
		var mpDatas = [];
		var governmentDatas = [];
		var oppositionDatas = [];
		var crossbenchDatas = [];
		var governmentParties = ['conservative', 'liberal-democrat'];
		var oppositionParties = ['labour'];

		$.each(data, function (key, val) {
			if (val.house_slug === searchHouse) {
				mpDatas.push(val);
				if ($.inArray(val.party_slug, governmentParties) > -1) {
					governmentDatas.push(val);
				} else if (searchHouse === 'commons' || $.inArray(val.party_slug, oppositionParties) > -1) {
					oppositionDatas.push(val);
				} else {
					crossbenchDatas.push(val);
				}
			}
		});

		d3.select("#governmentBench").selectAll("div")
		    .data(governmentDatas)
		  .enter().append("span")
		    .html(memberIcon);

		d3.select("#crossBench").selectAll("div")
		    .data(crossbenchDatas)
		  .enter().append("span")
		    .html(memberIcon);

		d3.select("#oppositionBench").selectAll("div")
		    .data(oppositionDatas)
		  .enter().append("span")
		    .html(memberIcon);
	});
});

