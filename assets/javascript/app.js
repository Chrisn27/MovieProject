
var request = function() {

  var apiKey = "33e1803f4a9e5bd978af9e30a5e9d1eaae120076";

  var url = "http://api-public.guidebox.com/v2/movies/137176"
	url += '?' + $.param({
		'api_key': apiKey
	})

		$.ajax({
			url: url,
			method: "GET"
		}).done(function(response) {

			var results = response.data;

				//console.log(url);
				console.log(response);
				//console.log(character);

		})

}

request();