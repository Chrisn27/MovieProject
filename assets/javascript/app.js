$(document).ready(function() {

        $('.modal').modal('close');
        $(".button-collapse").sideNav();

        //   $(".validate").validate({
        //       rules: {
        //           first_name: {
        //               required: true
        //           },
        //           last_name: {
        //               required: true
        //           },
        //           password: {
        // 		required: true,
        // 		minlength: 5
        // 	},
        // 	cpassword: {
        // 		required: true,
        // 		minlength: 5,
        // 		equalTo: "#password"
        // 	},
        //           email: {
        // 		required: true,
        //               email:true
        // 	},
        // },
        //       //For custom messages
        //       messages: {
        //           first_name:{
        //               required: "Enter a first name"
        //           },
        //           last_name:{
        //           	required: "Enter a last name",
        //               minlength: "Enter at least 5 characters"
        //           },
        //        errorElement : 'div',
        //        errorPlacement: function(error, element) {
        //          var placement = $(element).data('error');
        //          if (placement) {
        //            $(placement).append(error)
        //          } else {
        //            error.insertAfter(element);
        //          }
        //       	}
        //      }
        //   	});

        // -----------------------------------------------------------------------------------------------------
        // Initialize Firebase
        var config = {
            apiKey: 'AIzaSyC-7FZ_F_b4hHhD-WOtgqty8Q8hsG-OKzU',
            authDomain: 'movie-app-a7a97.firebaseapp.com',
            databaseURL: 'https://movie-app-a7a97.firebaseio.com',
            projectId: 'movie-app-a7a97',
            storageBucket: 'movie-app-a7a97.appspot.com',
            messagingSenderId: '894283834871'
        };
        firebase.initializeApp(config);

        // Create a variable to reference the database.
        var db = firebase.database();
        var userGenre = [];

        // Display current user created/logged-in (Nav bar)
        function setUser(email) {
            // Add current user email to nav bar
            var currentUser = $('<li id="current"><a class="waves-effect waves-light">').text(email);

            // Style user email in color black
            $(currentUser).css({
                color: 'black',
            });

            // Append currentUser to navbar placeholder = #current
            $('#current').append(currentUser);
        }

        // Display current user created/logged-in (Profile form)
        function setProfile(email) {
            // Add current user email to profile form
            var currentUser = $('<label for="disabled">Current User</label><br>').text('Profile: ' + email);

            // Append currentUser to Profile placeholder = #profile-user
            $('#profile-user').append(currentUser);
        }

        // capture click(s)


        // When Register Submit clicked, store email and password into variables
        $('#register-submit').on('click', function(event) {
            event.preventDefault();

            var email = $('#email').val().trim();
            var password = $('#password').val().trim();
            var cpassword = $('#cpassword').val().trim();


            // save to firebase db

            // query firebase db by user

            // Call firebase auth to set user in Auth db
            firebase.auth().createUserWithEmailAndPassword(email, password)

            // After user in Auth db, use Auth UID and store into Firebase db
            .then(function(user) {

                    $('#genre-pref input:checked').each(function() {
                        userGenre.push($(this).attr('data-genre'));
                    });
                    db.ref('/users/' + user.uid).set({
                        id: user.uid,
                        email: user.email,
                        genre: JSON.stringify(userGenre)
                    });
                    console.log(JSON.stringify(userGenre));

                    // Change Registration button text after successfully registered
                    var displaySuccess = 'Successfully Registered';
                    $('#register-submit').text(displaySuccess);

                    // Clear form when after successfully registered
                    $('#register-form').find('input:text, input:password').val('');

                    // Clear last user
                    $('#current').empty();

                    setProfile(email);
                    setUser(email);
                })
                .catch(function(err) {
                    console.error(err);
                    // .catch(function(err) {
                    // 	var errorCode = err.code;
                    //	var errorMessage = err.message;
                    // add error handling for (existing user, pw < 4 and pw comparison)
                    // 	console.log("Data not saved " + errorCode + errorMessage);	
                })
        });

        // When Login Submit clicked, store email and password into variables
        $('#login-submit').on('click', function(event) {
            event.preventDefault();

            var email = $('#login-email').val().trim();
            var password = $('#login-password').val().trim();

            // Call firebase auth to access user in Auth db
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(user) {

                    // Clear last user
                    $('#current').empty();

                    // Change Login button text after successfully logged-in
                    var displaySuccess = 'Successfully Logged-In';
                    $('#login-submit').text(displaySuccess);

                    setProfile(email);
                    setUser(email);

                    // get user genre
                    var currentUser = firebase.auth().currentUser.uid;
                    console.log(currentUser);

                    // var genre, email;

                    // if(user != null) {
                    // 	//genre = user.genre;
                    // 	email = user.email;
                    // 	genre = user.genre;
                    // }

                    //var currentGenre = db.ref('users/' + currentUser);
                    db.ref('users/' + currentUser + '/genre').once('value', function(snap) {
                        console.log('I fetched a user!', snap.val());
                    });

                    //console.log(currentGenre);

                })
                .catch(function(err) {
                    console.error(err);
                })
        });

        $('#profile-save').on('click', function(event) {
            event.preventDefault();

            var user = firebase.auth().currentUser;
            var password = $('#profile-password').val().trim();
            var newPassword = password;

            user.updatePassword(newPassword).then(function() {
                // Update successful.
                console.log(password);
            }, function(error) {
                // An error happened.
            });
        });

        // Clear & close Registration Modal when cancel clicked
        // Reset Register button text 
        $('#register-close').on('click', function(event) {
            event.preventDefault();
            $('#register-form').find('input:text, input:password').val('');
            $('.modal').modal('close');
            var displayRegister = 'Register';
            $('#register-submit').text(displayRegister);
        });

        // Clear & close Login Modal when cancel clicked
        // Reset Login button text 
        $('#login-close').on('click', function(event) {
            event.preventDefault();
            $('#login-form').find('input:text, input:password').val('');
            $('.modal').modal('close');
            var displayLogin = 'Login';
            $('#login-submit').text(displayLogin);
        });

        // Clear & close Profile Modal when cancel clicked
        // Reset Save button text 
        $('#profile-cancel').on('click', function(event) {
            event.preventDefault();
            $('#profile-form').find('input:text, input:password').val('');
            $('.modal').modal('close');
            var displaySave = 'Save';
            $('#login-submit').text(displaySave);
        });

//--------------------------------------------------------------------

	// global variables
	var limit = "20";
	var castLimit = "10";
	var userGenrePref = [];

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
		          buildMovieMenuItem(data,location, "");
	      	}); // closing outer ajax call done function
	} // closes buildInitialRecommendedResults

	var buildMovieMenuItem = function(data, location, genre) {

	var genreInput = genre;

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

						          var description = result.overview;

						          var genre = result.genres;

							      // sources obj has display name, link, and source eg.
									// display_name:"HBO (Via Amazon Prime)"
									// link:"http://www.amazon.com/gp/product/B01J7YLPGM?spp=hbo"
									// source:"hbo_amazon_prime"

								  var paidWebSources = result.subscription_web_sources;
						          var freeWebSources = result.free_web_sources;
						          var purchaseWebSources = result.purchase_web_sources;

						          // duration movie is in seconds
						          var duration = result.duration;

						          // extract cast names from cast result array
						          var cast = result.cast;
						          var castArr = [];
						          	for (var i=0; i<castLimit; i++) {
						          		castArr.push(cast[i].name)
						          	}

							      var tags = result.tags;

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
										      if (paidWebSources.length > 0 || freeWebSources.length > 0 || purchaseWebSources.length > 0) {

				
										      	// Build if genre was inputed, else build as normal
											      if (genreInput != "") {

													var found = false;
													for (var i = 0; i < genreInput.length; i++) {
													    if (genreArr.indexOf(genreInput[i]) > -1) {
													        found = true;
													        break;
													    }
													}

											      	if (found) {
											      		var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
													      	newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.join(", ")).attr("data-description", description);
													      	newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
													      	newMovieMenuDiv.attr("data-metascore", metascore).attr("data-cast", castArr.join(", "));
													      	newMovieMenuDiv.attr("data-subwebsources", JSON.stringify(paidWebSources)).attr("data-freewebsources", JSON.stringify(freeWebSources));
													      	newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources)).attr("data-duration", duration);

													      var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
													      var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
											      	}

											      }	


											      else {     
													      var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
													      	newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.join(", ")).attr("data-description", description);
													      	newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
													      	newMovieMenuDiv.attr("data-metascore", metascore).attr("data-cast", castArr.join(", "));
													      	newMovieMenuDiv.attr("data-subwebsources", JSON.stringify(paidWebSources)).attr("data-freewebsources", JSON.stringify(freeWebSources));
													      	newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources)).attr("data-duration", duration);

													      var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
													      var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
													      

													   //    var newMovieInfoDiv = $("<div>").addClass("movie-info").appendTo(newMovieMenuDiv);

													   //    var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
														  // var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
														  // var newGenre = $("<p>").addClass("movie-genre").text(genreArr.join(", ")).appendTo(newMovieInfoDiv);
													      
													   //    var newMovieSourceDiv = $("<div>").addClass("movie-sources").appendTo(newMovieInfoDiv);

													   //    for (var i=0; i<freeWebSources.length; i++) {
					
															 //      var newFreeLinkLogo = $("<a>").attr("href", freeWebSources[i].link).appendTo($(".modal-movie-sources"));
															 //      $("<img>").attr("src", "assets/images/free.png").appendTo(newFreeLinkLogo);
			  											//   }

													   //    for (var i=0; i<paidWebSources.length; i++) {
															      
													   //    		if (paidWebSources[i].source.indexOf("netflix") > -1) {
															 //      var newNetflixLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
															 //      $("<img>").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
															 //    }

															 //    if (paidWebSources[i].source.indexOf("amazon") > -1) {
															 //      var newAmazonLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
															 //      $("<img>").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
															 //    }
															     
															 //    if (paidWebSources[i].source.indexOf("hulu") > -1) {
															 //      var newHuluLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
															 //      $("<img>").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
															 //    }

														  // }


															 //      var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
															 //      var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
															 //      var newGenre = $("<p>").addClass("movie-genre").text(genreArr.toString()).appendTo(newMovieInfoDiv);

												      
												      
											  	  } // closing else statement
											  	} // closing if statement
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
    	var paidWebSources = ($(this).data("subscriptionsources"));
    	var cast = $(this).data("cast");
    	var metascore = $(this).data("metascore");
    	var paidWebSources = $(this).data("subwebsources");
    	var freeWebSources = $(this).data("freewebsources");
    	var purchaseWebSources = $(this).data("purchasewebsources");
    	var duration = parseInt($(this).data("duration"));
    	console.log(duration);
    	var durationMin = duration/60;

    	$(".modal-movie-title").text(title);
    	$(".modal-movie-year").text(year);
    	$(".modal-movie-poster").attr("src", posterUrl);
    	$(".modal-movie-genre").text(genre);
    	$(".modal-movie-description").text(description);
    	$("#modal-movie-duration").html("<strong>Duration:</strong> " + durationMin + " min");
    	$("#modal-movie-stars").html("<strong>Cast:</strong> " + cast + "...");
    	$("#modal-metascore").html("<strong>Metascore:</strong> " + metascore);

		$(".modal-movie-sources").empty();

    	for (var i=0; i<freeWebSources.length; i++) {
			
		      var newFreeLinkLogo = $("<a>").attr("target", "_blank").attr("href", freeWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/free.png").appendTo(newFreeLinkLogo);
	  	}

    	for (var i=0; i<paidWebSources.length; i++) {
													      
      		if (paidWebSources[i].source.indexOf("netflix") > -1) {
		      var newNetflixLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
		    }

		    if (paidWebSources[i].source.indexOf("amazon") > -1) {
		      var newAmazonLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
		    }
		     
		    if (paidWebSources[i].source.indexOf("hulu") > -1) {
		      var newHuluLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
		    }
		         
	  	}

	  	for (var i=0; i<purchaseWebSources.length; i++) {

	  		if (purchaseWebSources[i].source.indexOf("google") > -1) {
		      var newGoogleLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/googlePlay.png").appendTo(newGoogleLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("amazon") > -1) {
		      var newAmazonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("mgo") > -1 || purchaseWebSources[i].source.indexOf("fandango") > -1) {
		      var newFandangoLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/fandango.png").appendTo(newFandangoLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("vudu") > -1) {
		      var newVuduLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/vudu.png").appendTo(newVuduLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("youtube") > -1) {
		      var newYoutubeLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/youtube.png").appendTo(newYoutubeLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("sony") > -1) {
		      var newSonyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/sony.png").appendTo(newSonyLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("itunes") > -1) {
		      var newItunesLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/itunes.png").appendTo(newItunesLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("verizon") > -1) {
		      var newVerizonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/verizon.png").appendTo(newVerizonLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("cinema") > -1) {
		      var newCinemanowLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/cinemanow.png").appendTo(newCinemanowLinkLogo);
		    }
		    else if (purchaseWebSources[i].source.indexOf("disney") > -1) {
		      var newDisneyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/disney.png").appendTo(newDisneyLinkLogo);
		    }
			else {
		      var newPurchaseLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
		      $("<img>").addClass("linkLogo").attr("src", "assets/images/genericPurchase.png").appendTo(newPurchaseLinkLogo);
	  		}
	  	}

    });

    // appends items to results div after search term and re-populates recommended results
    $(".searchbtn").on("click", function(){

    	    event.preventDefault();
    	    
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
		        buildMovieMenuItem(data, location, "");

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
		          var location = ".recommendedResults";
		          buildMovieMenuItem(data,location, "");
	      	}); // closing outer ajax call done function

    }) // closes search button function

    // populates results and filters movies by genre before appending to html
    $(".genreDropdownItem").on("click", function(){
    	$(".searchResults").empty();
	    $(".recommendedResults").empty();

    	var genreInput = [];
    	genreInput.push($(this).text());
    	
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
		          var location = ".searchResults"
		          buildMovieMenuItem(data,location, genreInput);
	      	}); // closing outer ajax call done function


    }) // closes genre dropdown click function



}) // closes document.ready function

// -----------------------------------------------------------------------------------------------------
