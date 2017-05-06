$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    // dynamically changes modal values depending on what movie is clicked
    $(document).on("click", ".movieMenuDiv", function(){
    	var title = $(this).data("title");
    	var year = $(this).data("year");
    	var posterUrl = $(this).data("posterurl");
    	var genre = $(this).data("genre");
    	var description = $(this).data("description");
    	// var cast = $(this).data("title");

    	$(".modal-movie-title").text(title);
    	$(".modal-movie-year").text(year);
    	$(".modal-movie-poster").attr("src", posterUrl);
    	$(".modal-movie-genre").text(genre);
    	$(".modal-movie-description").text(description);
    });
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
					        	async: false,
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
										      async: false,
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

										      // Extract genres from genreArray
										      var genreArr = [];
										      for (var i=0; i<genre.length; i++) {
										      	genreArr.push(genre[i].title);
										      }

										      // Build html and append if there are actually free/subscription sources

										      if (paidWebSources.length > 0 || freeWebSources.length > 0) {
											      var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(".recommendedResults");
											      	newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.toString()).attr("data-description", description);
											      	newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
											      									      
											      var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
											      var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
											      
											      var newMovieInfoDiv = $("<div>").addClass("movie-info").appendTo(newMovieMenuDiv);
											      
											      // Viewing Sources
											      var newMovieSourceDiv = $("<div>").addClass("movie-sources").appendTo(newMovieInfoDiv);
											      var newNetflixLinkLogo = $("<a>").attr("href", "#").appendTo(newMovieSourceDiv);
											      	$("<img>").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
											      var newAmazonLinkLogo = $("<a>").attr("href", "#").appendTo(newMovieSourceDiv);
											      	$("<img>").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
											      var newHuluLinkLogo = $("<a>").attr("href", "#").appendTo(newMovieSourceDiv);
											      	$("<img>").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);

											      var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
											      var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
											      var newGenre = $("<p>").addClass("movie-genre").text(genreArr.toString()).appendTo(newMovieInfoDiv);

											      
										  	  }

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


