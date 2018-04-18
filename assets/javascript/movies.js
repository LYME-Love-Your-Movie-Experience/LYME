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

//Purchase Tickets URL generated to enable customer to buy tickets:
//example URL: https://www.amctheatres.com/movies/ready-player-one-48972/showtimes/ready-player-one-48972/4-18-2018/amc-metreon-16/all

var todaysDate = moment().format('MM-DD-YY')
var href = ""

href = "http://www.amctheaters.com/movies/" + "movieTitle" + "-" + "movieId" + "/showtimes" +
       "movieTitle" + "-" + "movieId" + "todaysDate" + "theatreLongName" + "/all"

function generatePurchaseLink(movieTitle, movieId, theatreLongName){
  var queryFilmName = movieTitle.toLowerCase();
  // Also sanitize by replacing spaces with -
  queryFilmName = queryFilmName.replace(/ /g , "-")
  // Replace apostrophes with dashes as well, for AMC API only!
  queryFilmName = queryFilmName.replace(/'/g,"-")
  var movieTitleAndID = queryFilmName + "-" + movieId;
  var href = "http://www.amctheaters.com/movies/";
  href += movieTitleAndID + "/showtimes/" + movieTitleAndID;
  href += "/" + todaysDate + "/" + theatreLongName + "/all";
  console.log(href);
  // "window.location.href='http://www.hyperlinkcode.com/button-links.php'"
  return `window.location.href='${href}'`;
}

// Call to users local theaters to check for matching "preferences" (attribute.codes)
$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/4145/showtimes/" + todaysDate,
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            console.log(response);
            console.log(response.Runtime);
            $.each(response._embedded.showtimes,function(index,item){
              console.log("Begin purchasing section here")
              console.log(item.movieId)
              console.log(item.movieName)
              console.log(item.attributes.code);
            });
         }
      });


//Set Ajax to GET movie data including Film Title, Film ID, Film Poster and Film MMPA Rating

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
              var textContainer = $('<div>').addClass("col s8");
              var mpaaRating = $('<div>').addClass("row kick-right").append('Rating:' + item.mpaaRating)
              
              var theaterListing = $('<div>').addClass("row")
              var theaterPreferencesContainer = $('<div>').addClass("row")
              
              var reviewHeader = $('<div>').addClass("row kick-right")
              var criticReview = $('<div>').addClass("col s4 grey darken-3 reviews-div")
              var userReview = $('<div>').addClass("col s4 grey darken-3 reviews-div")
              var image = $('<img>')
              image.height(300).width(200)
              image.attr('src', item.media.posterDynamic)
              imgContainer.append('<h5>' + item.name + '</h5>')
              imgContainer.append(image)
              imgContainer.append(mpaaRating)
             
              criticReview.html("Critic Review").addClass("center-align")
              userReview.html("User Review").addClass("center-align")
              attachScore(criticReview, userReview, item.name)
              reviewHeader.append(criticReview)
              reviewHeader.append(userReview)
              imgContainer.append(reviewHeader)

              for (var i = 1; i < 4; i++) {
                var individualTheater = $('<div>').addClass("col s3")
                individualTheater.html("<h5>Theater " + i + "</h5>")
                theaterListing.append(individualTheater)
              } 
              
              for (var i = 1; i < 4; i++) {
                var theaterPreferencesBucket = $('<div>').addClass("col s3 grey darken-3 theater-pref-div")
                var purchaseButton = $('<input type="button" value="Purchase"/>').addClass("red lighten-1 btn-small purchase-btn")
                purchaseButton.attr('onclick', generatePurchaseLink(item.name, item.id, "amc-metreon-16"));
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
              newRow.append('<hr class="movie-page-hr-break">')

              console.log(item.id);
              console.log(item.name);
              console.log(item.media.posterDynamic);
              $('.movie-container').append(newRow)

            });
         }
      });

//Set Ajax to GET movie and theater data (deprecated)

// $.ajax({
//          url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/2325/movies/48972/earliest-showtime",
//          headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
//          type: "GET",
//          success: function(response) { 
//             console.log(response);
//             console.log(response.purchaseUrl)
//             console.log(response.Runtime);
//             $.each(response.attributes,function(index,item){
//               console.log(item.code);

//             });
//             console.log(response.purchaseUrl) 
//          }
//       });

//API call to metacritic API to pull critic and user reviews

var metaCriticQueryURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/search/";
var metaCriticMovieURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/movie";

function attachScore(criticScore, userScore, filmName){
  console.log(userScore);
  criticScore.attr('id',"metacritic-score");
  // Need to sanitize the input, make it all lowercase
  var queryFilmName = filmName.toLowerCase();
  // Also sanitize by replacing spaces with -
  queryFilmName = queryFilmName.replace(/ /g , "-")
  var filmScoreNum = 0;
  var userScoreNum = 0;

  $.ajax({
    // url: metaCriticQueryURL + "/" + queryFilmName + "/movie?limit=20",
     url: metaCriticMovieURL + "/" + queryFilmName,
    headers: {
      "X-Mashape-Key": "UtlmLLXlvBmshzFE1DlVAFtq0Yp3p1z5KLqjsnTtLyKhWYrWgd",
      "Accept": "application/json",
      "Cache-Control": "no-cache"
    },
    type: "GET",
    success: function(response) { 
      // getthatresponse = response;
      console.log("MetaCritic " + queryFilmName);
      console.log(response[0].Rating);
      // filmScoreNum = response[0].SearchItems[0].Rating.CriticRating;
      filmScoreNum = response[0].Rating.CriticRating;
      userScoreNum = response[0].Rating.UserRating;
      // console.log("Score : " + filmScoreNum)
      criticScore.append("<br><h6>" + parseInt(filmScoreNum) + "/100 </h6>");
      userScore.append("<br><h6>" + userScoreNum + "/10</h6>")
      }
  });
}
