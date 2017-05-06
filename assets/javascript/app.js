$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

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
	// function logUser(user) {
 //    var ref = firebase.database().ref("users");
 //    var obj = {
 //        "user": user,
 //        ...
 //    };
 //    ref.push(obj); // or however you wish to update the node
// }


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
});
