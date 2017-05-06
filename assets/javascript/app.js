$(document).ready(function(){

	// global variables
	var limit = "5";
	var castLimit = "10";

    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC-7FZ_F_b4hHhD-WOtgqty8Q8hsG-OKzU",
    authDomain: "movie-app-a7a97.firebaseapp.com",
    databaseURL: "https://movie-app-a7a97.firebaseio.com",
    projectId: "movie-app-a7a97",
    storageBucket: "movie-app-a7a97.appspot.com",
    messagingSenderId: "894283834871"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var db = firebase.database();

	$('#register-submit').on("click", function(event) {
		event.preventDefault();
		alert("eyyy")
		//userID = $("#user").val().trim();
		var password = $("#password").val().trim();
		var cpassword = $("#cpassword").val().trim();
		var email = $("#email").val().trim();;

		// console.log(password);
		// console.log(cpassword);
		// console.log(email);

		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function(user) {
			console.log("inside createUserWithEmailAndPassword");
			// logUser(user);
			$('#modal-register').modal('close');
		})
		.catch(function(err) {
			var errorCode = err.code;
  			var errorMessage = err.message;

  			// add error handling for (existing user, pw < 4 and pw comparison)
			console.log("Data not saved " + errorCode + errorMessage);	
		})
	});
	//firebase.auth().curentUser to get current user info
	
	$('#login-submit').on("click", function(event) { 
		event.preventDefault();
		var password = $("#login-password").val().trim();
		var email = $("#login-email").val().trim();
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function(user) {
			console.log(user);
			$('#modal-login').modal('close');	
		})
		.catch(function(err) {
			console.error(err);
		})
	});

// ------------------------------------------------------------------------

	// global variables
	var limit = "5";
	var castLimit = "10";

    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

    var buildInitialRecommendedResults = function() {
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
		          var location = ".recommendedResults"
		          buildMovieMenuItem(data,location);
	      	}); // closing outer ajax call done function
	} // closes buildInitialRecommendedResults

	var buildMovieMenuItem = function(data, location) {
	for (var j=0; j<data.length; j++) {

			          var title = data[j].original_title;
			          var posterUrl = data[j].poster_400x570;
			          var year =  data[j].release_year;
			          var movieId = data[j].id;
			          var imdbId = data[j].imdb;

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
											      var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
											      	newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.toString()).attr("data-description", description);
											      	newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
											      									      
											      var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
											      var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
											      
											      var newMovieInfoDiv = $("<div>").addClass("movie-info").appendTo(newMovieMenuDiv);
											      
											      // Viewing Sources
											      var newMovieSourceDiv = $("<div>").addClass("movie-sources").appendTo(newMovieInfoDiv);

											      for (var i=0; i<paidWebSources.length; i++) {
													      
											      		if (paidWebSources[i].source.indexOf("netflix") > -1) {
													      var newNetflixLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
													      $("<img>").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
													    }

													    if (paidWebSources[i].source.indexOf("amazon") > -1) {
													      var newAmazonLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
													      $("<img>").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
													    }
													     
													    if (paidWebSources[i].source.indexOf("hulu") > -1) {
													      var newHuluLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
													      $("<img>").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
													    }

												  }

													      var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
													      var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
													      var newGenre = $("<p>").addClass("movie-genre").text(genreArr.toString()).appendTo(newMovieInfoDiv);
											      
											      
										  	  }

										    }); // closing outer ajax call done function
					      	}); // closing inner ajax call done function
				} // closing for loop
	} // closing buildMovieMenuItem function	

    // populate recommended results on start up
    buildInitialRecommendedResults();

    // dynamically changes modal values depending on what movie is clicked
    $(document).on("click", ".movieMenuDiv", function(){
    	var title = $(this).data("title");
    	var year = $(this).data("year");
    	var posterUrl = $(this).data("posterurl");
    	var genre = $(this).data("genre");
    	var description = $(this).data("description");
    	var paidWebSources = ($(this).data("subscriptionsources"))
    	// var cast = $(this).data("title");

    	$(".modal-movie-title").text(title);
    	$(".modal-movie-year").text(year);
    	$(".modal-movie-poster").attr("src", posterUrl);
    	$(".modal-movie-genre").text(genre);
    	$(".modal-movie-description").text(description);

    	for (var i=0; i<paidWebSources.length; i++) {
													      
      		if (paidWebSources[i].source.indexOf("netflix") > -1) {
		      var newNetflixLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
		    }

		    if (paidWebSources[i].source.indexOf("amazon") > -1) {
		      var newAmazonLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
		    }
		     
		    if (paidWebSources[i].source.indexOf("hulu") > -1) {
		      var newHuluLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
		    }
		         
	  	}

    });



    // appends items to results div after search term and re-populates recommended results
    $(".searchbtn").on("click", function(){
	    	var searchTerm = $("#search").val();
	    	$("#search").val("");
	    	$(".searchResults").empty();
	    	$(".recommendedResults").empty();

	    	// guidebox search ajax call and build function
	      	var url = "http://api-public.guidebox.com/v2/search?";
	        $.ajax({
		        url: url,
		        method: 'GET',
		        data: {
		        	"api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
		          	"type": "movie",
		          	"field": "title",
		          	"query": searchTerm,
		        }
	        }).done(function(result) {
	        	console.log(result);
		        var data = result.results;
		        var location = ".searchResults"

		        // build html function
		        buildMovieMenuItem(data, location);

	        }); // closing outer ajax call done function


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
		          var location = ".recommendedResults"
		          buildMovieMenuItem(data,location);
	      	}); // closing outer ajax call done function

    }) // closes search button function
}) // closes document.ready function

// -----------------------------------------------------------------------------------------------------
		




		


    

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