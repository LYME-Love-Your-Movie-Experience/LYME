//LYME - Love Your Movie Experience

//Set Firebase Database

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDfa2t2Nza2i5Vjpw_2adcPd6MxJFnxSW8",
  authDomain: "project-1-c94ae.firebaseapp.com",
  databaseURL: "https://project-1-c94ae.firebaseio.com",
  projectId: "project-1-c94ae",
  storageBucket: "project-1-c94ae.appspot.com",
  messagingSenderId: "186922710543"
};

firebase.initializeApp(config);



//Set Ajax to GET movie data

$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/movies/views/now-playing",
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            console.log(response);
            console.log(response.Runtime);
            $.each(response._embedded.movies,function(index,item){
              var newRow = $('<div>').addClass("row")
              var emptyCol = $('<div>').addClass("col s1")
              var emptyRow = $('<div>').addClass("row")
              var imgContainer = $('<div>').addClass("col s3");
              var textContainer = $('<div>').addClass("col s6");
              
              var theaterListing = $('<div>').addClass("row")
              var theaterPreferencesContainer = $('<div>').addClass("row")
              
              var reviewHeader = $('<div>').addClass("row")
              var criticReview = $('<div>').addClass("col s4")
              var userReview = $('<div>').addClass("col s4")
              var image = $('<img>')
              image.height(300).width(210)
              image.attr('src', item.media.posterDynamic)
              imgContainer.append('<h5>' + item.name + '</h5>')
              imgContainer.append(image)
             
              criticReview.html("Critic Review").addClass("center-align")
              userReview.html("User Review").addClass("center-align")
              reviewHeader.html("<h6>Reviews</h6>")
              reviewHeader.append(criticReview)
              reviewHeader.append(userReview)
              imgContainer.append(reviewHeader)

              for (var i = 1; i < 4; i++) {
                var individualTheater = $('<div>').addClass("col s4")
                individualTheater.html("<h5>Theater " + i + "</h5>")
                theaterListing.append(individualTheater)
              } 
              
              for (var i = 1; i < 4; i++) {
                var theaterPreferencesBucket = $('<div>').addClass("col s4")
                var purchaseButton = $('<input type="button" value="Purchase"/>')
                theaterPreferencesBucket.text("Preferences Listing " + i)
                theaterPreferencesBucket.append(purchaseButton)
                theaterPreferencesContainer.append(theaterPreferencesBucket)
              } 

              textContainer.append(emptyRow)
              textContainer.append(theaterListing).addClass("center-align")
              textContainer.append(theaterPreferencesContainer).addClass("center-align")

              newRow.append(emptyCol)
              newRow.append(imgContainer)
              newRow.append(textContainer)

              console.log(item.id);
              console.log(item.name);
              console.log(item.media.posterDynamic);
              $('.movie-container').append(newRow)

            });
         }
      });

//Set Ajax to GET movie and theater data

$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/2325/movies/48972/earliest-showtime",
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            console.log(response);
            console.log(response.Runtime);
            $.each(response.attributes,function(index,item){
              console.log(item.code);

            });
            console.log(response.purchaseUrl) 
         }
      });

//Set Ajax call for Metacritic Review serach by movie title

var metaCriticQueryURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/search/";
var metaCriticMovieURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/movie";

function attachScore(scoreParagraph, filmName){
  scoreParagraph.attr('id',"metacritic-score");
  // Need to sanitize the input, make it all lowercase
  var queryFilmName = filmName.toLowerCase();
  // Also sanitize by replacing spaces with -
  queryFilmName.replace(/ /g , "-")
  var filmScore = 0;

  $.ajax({
    url: metaCriticQueryURL + "/" + queryFilmName + "/movie?limit=20",
     // url: metaCriticQueryURL + "/" + filmName,
    headers: {
      "X-Mashape-Key": "UtlmLLXlvBmshzFE1DlVAFtq0Yp3p1z5KLqjsnTtLyKhWYrWgd",
      "Accept": "application/json",
      "Cache-Control": "no-cache"
    },
    type: "GET",
    success: function(response) { 
      getthatresponse = response;
      // console.log(response);
      filmScore = response[0].SearchItems[0].Rating.CriticRating;
      console.log("Score : " + filmScore)
      scoreParagraph.text("Score : " + parseInt(filmScore));
    }
  });
  }