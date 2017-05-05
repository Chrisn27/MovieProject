
	// $("").on("click", function() {

		var title;
	    var posterUrl;
	    var year;
	    var movieId;
	    var description;
	    var genre = [];
	    var freeWebSources;
	    var paidWebSources;
	    var duration;
	    var directors = [];
	    var cast = [];
	    var tags = [];
	    var metascore;

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

	          title = data[0].original_title;
	          posterUrl = data[0].poster_400x570;
	          year =  data[0].release_year;
	          movieId = data[0].id;
	          imdbId = data[0].imdb;
	          description = "";
	          duration = "";

      		  genre = [];
	          freeWebSources = [];
	          paidWebSources = [];
	          directors = [];
	          cast = [];
	          tags = [];
	          
	          	// for (var j=0; j<data.length; j++) {
			        
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

						          var genreArr = result.genres;
							      	for (var i = 0; i < genreArr.length; i++) {
							          	genre.push(genreArr[i].title);
							        }

							      // sources obj has display name, link, and source eg.
									// display_name:"HBO (Via Amazon Prime)"
									// link:"http://www.amazon.com/gp/product/B01J7YLPGM?spp=hbo"
									// source:"hbo_amazon_prime"

								  paidWebSources = result.subscription_web_sources;
						          freeWebSources = result.free_web_sources;

						          // duration movie is in seconds
						          duration = result.duration;

						          var castArr = result.cast;
						          	for (var i = 0; i < castLimit; i++) {
							          	cast.push(castArr[i].name);
							        }

							      var tagsArr = result.tags;
						          	for (var i = 0; i < tagsArr.length; i++) {
							          	tags.push(tagsArr[i].tag);
							        }

									console.log("title: " + title); 
						          console.log("year: " + year);
						          console.log("posterUrl: " + posterUrl);
						          console.log("movieId: " + movieId);
						          console.log("description: " + description);
						          console.log("genre: " + genre);
						          console.log("tags: " + tags);
						          console.log("freeWebSources: " + JSON.stringify(freeWebSources));
						          console.log("paidWebSources: " + JSON.stringify(paidWebSources));
						          console.log("duration (sec): " + duration);
						          console.log("cast: " + cast + "...");
						    //       console.log("-------------------------------------------------------------------------------------");

					      	}); // closing inner ajax call done function

				      

				// } // closing for loop

      	}); // closing outer ajax call done function

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

        var queryURL = "http://www.omdbapi.com/?";
	    $.ajax({
	      url: queryURL,
	      method: "GET",
	      data: {
	      		// imdb id for suicide squad taken from guidebox
	        	"i": "tt1386697",
	        }
	    }).done(function(response) {
	      console.log(response);

	      // score from metacritic
	      metascore = response.Metascore;

	    }); // closing outer ajax call done function

	// });
