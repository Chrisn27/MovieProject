<<<<<<< user-validations
        //--------------------------------------------------------------------

        // global variables
        var limit = "2";
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
                        "api_key": "33e1803f4a9e5bd978af9e30a5e9d1eaae120076",
                        "limit": limit,
                        // "offset" : 250,
                    }
                }).done(function(result) {
                    console.log(result);
                    var data = result.results;
                    var location = ".recommendedResults"
                    buildMovieMenuItem(data, location, "");
                }); // closing outer ajax call done function
            } // closes buildInitialRecommendedResults

        var buildMovieMenuItem = function(data, location, genre) {

                var genreInput = genre;

                for (var j = 0; j < data.length; j++) {

                    var title = data[j].original_title;
                    var posterUrl = data[j].poster_400x570;
                    var year = data[j].release_year;
                    var movieId = data[j].id;
                    var imdbId = data[j].imdb;


                    var urlId = "http://api-public.guidebox.com/v2/movies/" + movieId;
                    $.ajax({
                        async: false,
                        url: urlId,
                        method: 'GET',
                        data: {
                            "api_key": "33e1803f4a9e5bd978af9e30a5e9d1eaae120076",
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


                        var trailer = result.trailers.web;
                        var trailerArr = [];
                        for (var i = 0; i < trailer.length; i++) {
                            trailerArr.push(trailer[i].embed)
                        }

                        // duration movie is in seconds
                        var duration = result.duration;

                        // extract cast names from cast result array
                        var cast = result.cast;
                        var castArr = [];
                        for (var i = 0; i < castLimit; i++) {
                            castArr.push(cast[i].name)
                        }

                        var tags = result.tags;




                        console.log("description: " + description);
                        console.log("genre: " + JSON.stringify(genre));
                        console.log("freeWebSources: " + JSON.stringify(freeWebSources));
                        console.log("paidWebSources: " + JSON.stringify(paidWebSources));
                        console.log("duration (sec): " + duration);
                        console.log("trailer " + trailer);
                        console.log(trailerArr);
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
                            for (var i = 0; i < genre.length; i++) {
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

                                        newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources));
                                        newMovieMenuDiv.attr("data-trailers", trailerArr);

                                        newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources)).attr("data-duration", duration);


                                        var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
                                        var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
                                    }

                                } else {
                                    var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
                                    newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.join(", ")).attr("data-description", description);
                                    newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
                                    newMovieMenuDiv.attr("data-metascore", metascore).attr("data-cast", castArr.join(", "));
                                    newMovieMenuDiv.attr("data-subwebsources", JSON.stringify(paidWebSources)).attr("data-freewebsources", JSON.stringify(freeWebSources));

                                    newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources));
                                    newMovieMenuDiv.attr("data-trailers", trailerArr);

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

                                    //          if (paidWebSources[i].source.indexOf("netflix") > -1) {
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
        $(document).on("click", ".movieMenuDiv", function() {

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

            var trailer = $(this).data("trailers");
            console.log(trailer);

            var duration = parseInt($(this).data("duration"));
            console.log(duration);
            var durationMin = duration / 60;


            $(".modal-movie-title").text(title);
            $(".modal-movie-year").text(year);
            $(".modal-movie-poster").attr("src", posterUrl);
            $(".modal-movie-genre").text(genre);
            $(".modal-movie-description").text(description);
            $("#modal-movie-duration").html("<strong>Duration:</strong> " + durationMin + " min");
            $("#modal-movie-stars").html("<strong>Cast:</strong> " + cast + "...");
            $("#modal-metascore").html("<strong>Metascore:</strong> " + metascore);

            $(".modal-movie-sources").empty();
            $(".video-container").empty();

            for (var i = 0; i < freeWebSources.length; i++) {

                var newFreeLinkLogo = $("<a>").attr("target", "_blank").attr("href", freeWebSources[i].link).appendTo($(".modal-movie-sources"));
                $("<img>").addClass("linkLogo").attr("src", "assets/images/free.png").appendTo(newFreeLinkLogo);
            }

            for (var i = 0; i < paidWebSources.length; i++) {

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

            for (var i = 0; i < purchaseWebSources.length; i++) {

                if (purchaseWebSources[i].source.indexOf("google") > -1) {
                    var newGoogleLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/googlePlay.png").appendTo(newGoogleLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("amazon") > -1) {
                    var newAmazonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("mgo") > -1 || purchaseWebSources[i].source.indexOf("fandango") > -1) {
                    var newFandangoLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/fandango.png").appendTo(newFandangoLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("vudu") > -1) {
                    var newVuduLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/vudu.png").appendTo(newVuduLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("youtube") > -1) {
                    var newYoutubeLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/youtube.png").appendTo(newYoutubeLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("sony") > -1) {
                    var newSonyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/sony.png").appendTo(newSonyLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("itunes") > -1) {
                    var newItunesLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/itunes.png").appendTo(newItunesLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("verizon") > -1) {
                    var newVerizonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/verizon.png").appendTo(newVerizonLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("cinema") > -1) {
                    var newCinemanowLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/cinemanow.png").appendTo(newCinemanowLinkLogo);
                } else if (purchaseWebSources[i].source.indexOf("disney") > -1) {
                    var newDisneyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/disney.png").appendTo(newDisneyLinkLogo);
                } else {
                    var newPurchaseLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
                    $("<img>").addClass("linkLogo").attr("src", "assets/images/genericPurchase.png").appendTo(newPurchaseLinkLogo);
                }
            }

            var embedTrailer = $("<iframe>").attr("src", trailer);
            embedTrailer.attr("frameborder", 0);
            embedTrailer.attr("allowfullscreen");

            $(".video-container").append(embedTrailer);

        });

        // appends items to results div after search term and re-populates recommended results
        $(".searchbtn").on("click", function() {

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
                    buildMovieMenuItem(data, location, "");
                }); // closing outer ajax call done function

            }) // closes search button function

        // populates results and filters movies by genre before appending to html
        $(".genreDropdownItem").on("click", function() {
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
                    buildMovieMenuItem(data, location, genreInput);
                }); // closing outer ajax call done function


            }) // closes genre dropdown click function



    }) // closes document.ready function
    // =======
    // //--------------------------------------------------------------------

//  // global variables
//  var limit = "10";
//  var castLimit = "10";
//  var userGenrePref = [];

//     // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
//     $('.modal').modal();

//     var buildInitialRecommendedResults = function(genre) {
//      var url = "http://api-public.guidebox.com/v2/movies/";
//          $.ajax({
//              url: url,
//              method: 'GET',
//              data: {
//                  "api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
//                  "limit": limit,
//                  // "offset" : 250,
//              }
//          }).done(function(result) {
//                console.log(result);
//                var data = result.results;
//                var location = ".recommendedResults"
//                buildMovieMenuItem(data,location,genre);
//          }); // closing outer ajax call done function
//  } // closes buildInitialRecommendedResults

//  var buildMovieMenuItem = function(data, location, genre) {

//  var genreInput = genre;

//  for (var j=0; j<data.length; j++) {

//                    var title = data[j].original_title;
//                    var posterUrl = data[j].poster_400x570;
//                    var year =  data[j].release_year;
//                    var movieId = data[j].id;
//                    var imdbId = data[j].imdb;


//                          var urlId = "http://api-public.guidebox.com/v2/movies/" + movieId;
//                          $.ajax({
//                              async: false,
//                              url: urlId,
//                              method: 'GET',
//                              data: {
//                                  "api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
//                              }
//                          }).done(function(result) {
//                                console.log(result);

//                                var description = result.overview;

//                                var genre = result.genres;

//                                // sources obj has display name, link, and source eg.
//                                  // display_name:"HBO (Via Amazon Prime)"
//                                  // link:"http://www.amazon.com/gp/product/B01J7YLPGM?spp=hbo"
//                                  // source:"hbo_amazon_prime"

//                                var paidWebSources = result.subscription_web_sources;
//                                var freeWebSources = result.free_web_sources;
//                                var purchaseWebSources = result.purchase_web_sources; 


//                                var trailer = result.trailers.web;
//                                var trailerArr = [];
//                                  for (var i=0; i<trailer.length; i++) {
//                                      trailerArr.push(trailer[i].embed)
//                                  }

//                                // duration movie is in seconds
//                                var duration = result.duration;

//                                // extract cast names from cast result array
//                                var cast = result.cast;
//                                var castArr = [];
//                                  for (var i=0; i<castLimit; i++) {
//                                      castArr.push(cast[i].name)
//                                  }

//                                var tags = result.tags;




//                                console.log("description: " + description);
//                                console.log("genre: " + JSON.stringify(genre));
//                                console.log("freeWebSources: " + JSON.stringify(freeWebSources));
//                                console.log("paidWebSources: " + JSON.stringify(paidWebSources));
//                                console.log("duration (sec): " + duration);
//                                console.log("trailer " + trailer);
//                                console.log(trailerArr);
//                                // console.log("cast: " + JSON.stringify(cast) + "...");

//                                    // omdb search function uing imdb id from guidebox
//                                          $.ajax({
//                                            async: false,
//                                            url: "http://www.omdbapi.com/?",
//                                            method: "GET",
//                                            data: {
//                                                  // imdb id for suicide squad taken from guidebox
//                                                  "i": imdbId,
//                                              }
//                                          }).done(function(response) {
//                                            // console.log(response);

//                                            // score from metacritic
//                                            metascore = response.Metascore;
//                                            console.log("metascore: " + metascore);                                  
//                                            console.log("-------------------------------------------------------------------------------------");




//                                            // Extract genres from genreArray
//                                            var genreArr = [];
//                                            for (var i=0; i<genre.length; i++) {
//                                              genreArr.push(genre[i].title);
//                                            }


//                                            // Build html and append if there are actually free/subscription sources
//                                            if (paidWebSources.length > 0 || freeWebSources.length > 0 || purchaseWebSources.length > 0) {


//                                              // Build if genre was inputed, else build as normal
//                                                if (genreInput != "") {

//                                                  var found = false;
//                                                  for (var i = 0; i < genreInput.length; i++) {
//                                                      if (genreArr.indexOf(genreInput[i]) > -1) {
//                                                          found = true;
//                                                          break;
//                                                      }
//                                                  }

//                                                  if (found) {
//                                                      var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
//                                                          newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.join(", ")).attr("data-description", description);
//                                                          newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
//                                                          newMovieMenuDiv.attr("data-metascore", metascore).attr("data-cast", castArr.join(", "));
//                                                          newMovieMenuDiv.attr("data-subwebsources", JSON.stringify(paidWebSources)).attr("data-freewebsources", JSON.stringify(freeWebSources));

//                                                          newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources));
//                                                          newMovieMenuDiv.attr("data-trailers", trailerArr);

//                                                          newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources)).attr("data-duration", duration);


//                                                        var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
//                                                        var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);
//                                                  }

//                                                } 


//                                                else {     
//                                                        var newMovieMenuDiv = $("<div>").addClass("movieMenuDiv").attr("data-guideboxid", movieId).appendTo(location);
//                                                          newMovieMenuDiv.attr("data-title", title).attr("data-genre", genreArr.join(", ")).attr("data-description", description);
//                                                          newMovieMenuDiv.attr("data-posterurl", posterUrl).attr("data-year", year);
//                                                          newMovieMenuDiv.attr("data-metascore", metascore).attr("data-cast", castArr.join(", "));
//                                                          newMovieMenuDiv.attr("data-subwebsources", JSON.stringify(paidWebSources)).attr("data-freewebsources", JSON.stringify(freeWebSources));

//                                                          newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources));
//                                                          newMovieMenuDiv.attr("data-trailers", trailerArr);

//                                                          newMovieMenuDiv.attr("data-purchasewebsources", JSON.stringify(purchaseWebSources)).attr("data-duration", duration);


//                                                        var newAElement = $("<a>").addClass("waves-effect waves-light").attr("href", "#modal1").appendTo(newMovieMenuDiv);
//                                                        var newImg = $("<img>").addClass("moviePoster").attr("src", posterUrl).appendTo(newAElement);


//                                                     //    var newMovieInfoDiv = $("<div>").addClass("movie-info").appendTo(newMovieMenuDiv);

//                                                     //    var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
//                                                        // var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
//                                                        // var newGenre = $("<p>").addClass("movie-genre").text(genreArr.join(", ")).appendTo(newMovieInfoDiv);

//                                                     //    var newMovieSourceDiv = $("<div>").addClass("movie-sources").appendTo(newMovieInfoDiv);

//                                                     //    for (var i=0; i<freeWebSources.length; i++) {

//                                                           //      var newFreeLinkLogo = $("<a>").attr("href", freeWebSources[i].link).appendTo($(".modal-movie-sources"));
//                                                           //      $("<img>").attr("src", "assets/images/free.png").appendTo(newFreeLinkLogo);
//                                                      //   }

//                                                     //    for (var i=0; i<paidWebSources.length; i++) {

//                                                     //           if (paidWebSources[i].source.indexOf("netflix") > -1) {
//                                                           //      var newNetflixLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
//                                                           //      $("<img>").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
//                                                           //    }

//                                                           //    if (paidWebSources[i].source.indexOf("amazon") > -1) {
//                                                           //      var newAmazonLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
//                                                           //      $("<img>").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
//                                                           //    }

//                                                           //    if (paidWebSources[i].source.indexOf("hulu") > -1) {
//                                                           //      var newHuluLinkLogo = $("<a>").attr("href", paidWebSources[i].link).appendTo(newMovieSourceDiv);
//                                                           //      $("<img>").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
//                                                           //    }

//                                                        // }


//                                                           //      var newTitle = $("<p>").addClass("movie-title").text(title).appendTo(newMovieInfoDiv);
//                                                           //      var newYear = $("<p>").addClass("movie-year").text(year).appendTo(newMovieInfoDiv);
//                                                           //      var newGenre = $("<p>").addClass("movie-genre").text(genreArr.toString()).appendTo(newMovieInfoDiv);



//                                                } // closing else statement
//                                              } // closing if statement
//                                          }); // closing outer ajax call done function
//                          }); // closing inner ajax call done function
//              } // closing for loop
//  } // closing buildMovieMenuItem function    

//     // populate recommended results on start up
//     buildInitialRecommendedResults("");

//     // dynamically changes modal values depending on what movie is clicked
//     $(document).on("click", ".movieMenuDiv", function(){

//      var title = $(this).data("title");
//      var year = $(this).data("year");
//      var posterUrl = $(this).data("posterurl");
//      var genre = $(this).data("genre");
//      var description = $(this).data("description");
//      var paidWebSources = ($(this).data("subscriptionsources"));
//      var cast = $(this).data("cast");
//      var metascore = $(this).data("metascore");
//      var paidWebSources = $(this).data("subwebsources");
//      var freeWebSources = $(this).data("freewebsources");
//      var purchaseWebSources = $(this).data("purchasewebsources");

//      var trailer = $(this).data("trailers");
//      console.log(trailer);

//      var duration = parseInt($(this).data("duration"));
//      console.log(duration);
//      var durationMin = duration/60;


//      $(".modal-movie-title").text(title);
//      $(".modal-movie-year").text(year);
//      $(".modal-movie-poster").attr("src", posterUrl);
//      $(".modal-movie-genre").text(genre);
//      $(".modal-movie-description").text(description);
//      $("#modal-movie-duration").html("<strong>Duration:</strong> " + durationMin + " min");
//      $("#modal-movie-stars").html("<strong>Cast:</strong> " + cast + "...");
//      $("#modal-metascore").html("<strong>Metascore:</strong> " + metascore);

//      $(".modal-movie-sources").empty();
//      $(".video-container").empty();

//      for (var i=0; i<freeWebSources.length; i++) {

//            var newFreeLinkLogo = $("<a>").attr("target", "_blank").attr("href", freeWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/free.png").appendTo(newFreeLinkLogo);
//      }

//      for (var i=0; i<paidWebSources.length; i++) {

//              if (paidWebSources[i].source.indexOf("netflix") > -1) {
//            var newNetflixLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/netflix.png").appendTo(newNetflixLinkLogo);
//          }

//          if (paidWebSources[i].source.indexOf("amazon") > -1) {
//            var newAmazonLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
//          }

//          if (paidWebSources[i].source.indexOf("hulu") > -1) {
//            var newHuluLinkLogo = $("<a>").attr("target", "_blank").attr("href", paidWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/hulu.png").appendTo(newHuluLinkLogo);
//          }

//      }

//      for (var i=0; i<purchaseWebSources.length; i++) {

//          if (purchaseWebSources[i].source.indexOf("google") > -1) {
//            var newGoogleLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/googlePlay.png").appendTo(newGoogleLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("amazon") > -1) {
//            var newAmazonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/amazon.png").appendTo(newAmazonLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("mgo") > -1 || purchaseWebSources[i].source.indexOf("fandango") > -1) {
//            var newFandangoLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/fandango.png").appendTo(newFandangoLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("vudu") > -1) {
//            var newVuduLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/vudu.png").appendTo(newVuduLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("youtube") > -1) {
//            var newYoutubeLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/youtube.png").appendTo(newYoutubeLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("sony") > -1) {
//            var newSonyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/sony.png").appendTo(newSonyLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("itunes") > -1) {
//            var newItunesLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/itunes.png").appendTo(newItunesLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("verizon") > -1) {
//            var newVerizonLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/verizon.png").appendTo(newVerizonLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("cinema") > -1) {
//            var newCinemanowLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/cinemanow.png").appendTo(newCinemanowLinkLogo);
//          }
//          else if (purchaseWebSources[i].source.indexOf("disney") > -1) {
//            var newDisneyLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/disney.png").appendTo(newDisneyLinkLogo);
//          }
//          else {
//            var newPurchaseLinkLogo = $("<a>").attr("target", "_blank").attr("href", purchaseWebSources[i].link).appendTo($(".modal-movie-sources"));
//            $("<img>").addClass("linkLogo").attr("src", "assets/images/genericPurchase.png").appendTo(newPurchaseLinkLogo);
//          }
//      }

//          var embedTrailer = $("<iframe>").attr("src", trailer);
//          embedTrailer.attr("frameborder",0);
//          embedTrailer.attr("allowfullscreen");           

//          $(".video-container").append(embedTrailer);

//     });

//     // appends items to results div after search term and re-populates recommended results
//     $(".searchbtn").on("click", function(){

//          event.preventDefault();

//          var searchTerm = $("#search").val();
//          $("#search").val("");
//          $(".searchResults").empty();
//          $(".recommendedResults").empty();

//          // guidebox search ajax call and build function
//          var url = "http://api-public.guidebox.com/v2/search?";
//          $.ajax({
//              url: url,
//              method: 'GET',
//              data: {
//                  "api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
//                  "type": "movie",
//                  "field": "title",
//                  "query": searchTerm,
//              }
//          }).done(function(result) {
//              console.log(result);
//              var data = result.results;
//              var location = ".searchResults"

//              // build html function
//              buildMovieMenuItem(data, location, "");

//          }); // closing outer ajax call done function


//          var url = "http://api-public.guidebox.com/v2/movies/";
//          $.ajax({
//              url: url,
//              method: 'GET',
//              data: {
//                  "api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
//                  "limit": limit,
//                  // "offset" : 250,
//              }
//          }).done(function(result) {
//                console.log(result);
//                var data = result.results;
//                var location = ".recommendedResults";
//                buildMovieMenuItem(data,location, "");
//          }); // closing outer ajax call done function

//     }) // closes search button function

//     // populates results and filters movies by genre before appending to html
//     $(".genreDropdownItem").on("click", function(){
//      $(".searchResults").empty();
//      $(".recommendedResults").empty();

//      var genreInput = [];
//      genreInput.push($(this).text());

//      var url = "http://api-public.guidebox.com/v2/movies/";
//          $.ajax({
//              url: url,
//              method: 'GET',
//              data: {
//                  "api_key": "69036535aa6cd6d9b5932b7ee76407ea77cabb6d",
//                  "limit": limit,
//                  // "offset" : 250,
//              }
//          }).done(function(result) {
//                console.log(result);
//                var data = result.results;
//                var location = ".searchResults"
//                buildMovieMenuItem(data,location, genreInput);
//          }); // closing outer ajax call done function


//     }) // closes genre dropdown click function



// }) // closes document.ready function
// >>>>>>> ef43f98b5926e568adb9586efa0325d6a4712f10

// -----------------------------------------------------------------------------------------------------
=======
//--------------------------------------------------------------------
