$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

// -----------------------------------------------------------------------------------------------------
		var limit = "5";
		var castLimit = "10";
		// var searchTerm = $(this).text();

		var url = "http://api-public.guidebox.com/v2/movies/";
        $.ajax({
	        url: url,
	        method: 'GET',
	        data: {
	        	"api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
	          	"limit": limit,
	          	// "offset" : 250,
	        }
        }).done(function(result) {
	          console.log(result);
	          var data = result.results;

	          for (var j=0; j<data.length; j++) {

			          var title = data[j].original_title;
			          var posterUrl = data[j].poster_400x570;
			          var year =  data[j].release_year;
			          var movieId = data[j].id;
			          var imdbId = data[j].imdb;

			          console.log(title, posterUrl, year, movieId, imdbId);
			        
	          				var urlId = "http://api-public.guidebox.com/v2/movies/" + movieId;
					        $.ajax({
						        url: urlId,
						        method: 'GET',
						        data: {
						        	"api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
						        }
					        }).done(function(result) {
						          console.log(result);

						          description = result.overview;

						          genre = result.genres;

							      // sources obj has display name, link, and source eg.
									// display_name:"HBO (Via Amazon Prime)"
									// link:"http://www.amazon.com/gp/product/B01J7YLPGM?spp=hbo"
									// source:"hbo_amazon_prime"

								  paidWebSources = result.subscription_web_sources;
						          freeWebSources = result.free_web_sources;

						          // duration movie is in seconds
						          duration = result.duration;
						          cast = result.cast;
							      tags = result.tags;

						          console.log("description: " + description);
						          console.log("genre: " + JSON.stringify(genre));
						          console.log("freeWebSources: " + JSON.stringify(freeWebSources));
						          console.log("paidWebSources: " + JSON.stringify(paidWebSources));
						          console.log("duration (sec): " + duration);
						          
						          // console.log("cast: " + JSON.stringify(cast) + "...");

						              // omdb search function uing imdb id from guidebox
										    $.ajax({
										      url: "http://www.omdbapi.com/?",
										      method: "GET",
										      data: {
										      		// imdb id for suicide squad taken from guidebox
										        	"i": imdbId,
										        }
										    }).done(function(response) {
										      // console.log(response);

										      // score from metacritic
										      metascore = response.Metascore;
										      console.log("metascore: " + metascore);
										      console.log("-------------------------------------------------------------------------------------");

										    }); // closing outer ajax call done function

					      	}); // closing inner ajax call done function

				} // closing for loop

      	}); // closing outer ajax call done function

    // guidebox search function
      	var url = "http://api-public.guidebox.com/v2/search?";
        $.ajax({
	        url: url,
	        method: 'GET',
	        data: {
	        	"api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
	          	"type": "movie",
	          	"field": "title",
	          	"query": "terminator",
	        }
        }).done(function(result) {
        	console.log(result);
        }); // closing outer ajax call done function

    // // omdb search function uing imdb id from guidebox
	   //  $.ajax({
	   //    url: "http://www.omdbapi.com/?",
	   //    method: "GET",
	   //    data: {
	   //    		// imdb id for suicide squad taken from guidebox
	   //      	"i": imdbId,
	   //      }
	   //  }).done(function(response) {
	   //    // console.log(response);

	   //    // score from metacritic
	   //    metascore = response.Metascore;
	   //    console.log("metascore: " + metascore);
			 //  console.log("-------------------------------------------------------------------------------------");

	   //  }); // closing omdb ajax call done function


