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

var database =  firebase.database();
var refMovies = firebase.database().ref('/movies/');

var key = localStorage.getItem('key')

var user_theaters
var user_prefences

// NOTE: This is getting hard coded for now, we may want to store 'page size' as an attribute of movies in the database
var numMovies = 0;
var moviesArr = [];
var movieIDArr = [];

class showing{
  constructor(movieName, theaterName, movieID, movieProperties){
    this.movieName = movieName;
    this.theaterName = theaterName;
    this.movieID = movieID;
    this.movieProperties = movieProperties;
  }
}

var ArrayOfShowings = []

//Event listener for movie nodes
refMovies.orderByKey().on("child_added", function(snapshot) {

  numMovies++;

  var item ={
    name: snapshot.val().name,
    id: snapshot.val().id,
    mpaaRating: snapshot.val().rating,
    poster : snapshot.val().poster
  }

  moviesArr.push(item.name);
  movieIDArr.push(item.id);

  var newRow = $('<div>').addClass("row")
  newRow.attr('id', item.name)
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
  image.attr('src', item.poster)
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
    individualTheater.attr('id', "_theater_" + i)
    individualTheater.addClass("theater" + i)
    individualTheater.html("<h5>Theater " + i + "</h5>")
    // individualTheater.html("<h5>Theater " + user_theaters[i-1].name + "</h5>")
    theaterListing.append(individualTheater)
  } 
  
  for (var i = 1; i < 4; i++) {
    var niceMovieName = item.name.toLowerCase();
    niceMovieName = niceMovieName.replace(/ /g , "-")
    niceMovieName = niceMovieName.replace(/'/g,"-")
    var theaterPreferencesBucket = $('<div>').addClass("col s3 grey darken-3 theater-pref-div")
    theaterPreferencesBucket.attr('id', niceMovieName + "_theater_" + i)
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

  // console.log(item.id);
  // console.log(item.name);
  // console.log(item.posterDynamic);
  $('.movie-container').append(newRow)
});


if(key !== null){  
    console.log(key, typeof key)
    function getUser(key){
      return new Promise(function(resolve, reject) {
        var ref = firebase.database().ref('users/' + key)
        // console.log(ref)
        console.log('about to query')
        ref.on('value', function(snapshot) {
          sv = snapshot.val()
          user_theaters = sv.user_theatres
          user_preferences = sv.user_preferences
          console.log(user_theaters[0].name)
          $(".theater1").html("<h5>" + user_theaters[0].name + "</h5>")
          $(".theater2").html("<h5>" + user_theaters[1].name + "</h5>")
          $(".theater3").html("<h5>" + user_theaters[2].name + "</h5>")

          console.log(user_theaters, user_preferences)
          resolve(true)  
        })    
      })
    }

    getUser(key)
      .then(function(valid) {
        if (valid) {
          console.log('resolved')
          //Iterate over all movies
          for (var i = 0; i < numMovies; i++){
            
            var niceMovieName = moviesArr[i].toLowerCase();
            niceMovieName = niceMovieName.replace(/ /g , "-")
            niceMovieName = niceMovieName.replace(/'/g,"-")
            console.log(niceMovieName);
            //Iterate over theaters
            for (var j = 1; j <= user_theaters.length; j++){
              var theaterAndMovieProperties = [];
              var requests = [];
              var req = $.ajax({
                 url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/" +
                 user_theaters[j-1].id + "/movies/" + movieIDArr[i] + "/earliest-showtime",
                 headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
                 type: "GET"
              }).done(function (resp){
                $.each(resp.attributes,function(index,item){
                  // console.log(item.code);
                  theaterAndMovieProperties.push(item.code);
                })
              }).fail(function(jqXHR, status){
                console.log("Fail" + jqXHR);
                return;
              });
              
              requests.push(req);

              $.when(requests).done(function() {
                console.log("lol" + theaterAndMovieProperties.length)
                for (var k = 0; k < user_preferences.length; k++){

                  for (var l = 0; l < theaterAndMovieProperties.length; l++){
                    console.log("test " + user_preferences[k] + " against " + item.code)
                    if (user_preferences[k] === theaterAndMovieProperties[l].toLowerCase()){
                      console.log(item.code + ", match j is " + j);
                      var buildID = niceMovieName + "_theater_";
                      buildID += j;
                      console.log(buildID);
                      // $("#")
                    }
                    
                  }
                }
              })

            }
          }
          //   for (var j = 0; j < user_preferences.length; j++){
          // }
          //PUT CODE FOR THE USER HERE, IN REGARDS TO CHECKING THEATERS AND PREFERENCES
        }
      })
} else {
  console.log("Null Key!  No user!")
}

// scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {
//   snapshot.forEach(function(data) {
//     console.log("The " + data.key + " score is " + data.val());
//   });
// });

//https://www.amctheatres.com/movies/ready-player-one-48972/showtimes/ready-player-one-48972/4-18-2018/amc-metreon-16/all
// var movieId = ""
// var movieTitle = ""
// var theatreLongName = ""
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
  // console.log(href);
  // "window.location.href='http://www.hyperlinkcode.com/button-links.php'"
  return `window.location.href='${href}'`;
}

// Call to users local theaters to check for matching "preferences" (attribute.codes)
$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/4145/showtimes/" + todaysDate,
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            // console.log(response);
            // console.log(response.Runtime);
            $.each(response._embedded.showtimes,function(index,item){
              // console.log("Begin purchasing section here")
              // console.log(item.movieId)
              // console.log(item.movieName)
              // console.log(item.attributes.code);
            });
         }
      });


//Set Ajax to GET movie data including Film Title, Film ID, Film Poster and Film MMPA Rating

// $.ajax({
//          url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/movies/views/now-playing",
//          headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
//          type: "GET",
//          success: function(response) { 
//             console.log(response);
//             console.log(response.Runtime);
//             $.each(response._embedded.movies,function(index,item){
//               var newRow = $('<div>').addClass("row")
//               var emptyCol = $('<div>').addClass("col s1")
//               var emptyRow = $('<div>').addClass("row")
//               var imgContainer = $('<div>').addClass("col s3");
//               var textContainer = $('<div>').addClass("col s8");
//               var mpaaRating = $('<div>').addClass("row kick-right").append('Rating:' + item.mpaaRating)
              
//               var theaterListing = $('<div>').addClass("row")
//               var theaterPreferencesContainer = $('<div>').addClass("row")
              
//               var reviewHeader = $('<div>').addClass("row kick-right")
//               var criticReview = $('<div>').addClass("col s4 grey darken-3 reviews-div")
//               var userReview = $('<div>').addClass("col s4 grey darken-3 reviews-div")
//               var image = $('<img>')
//               image.height(300).width(200)
//               image.attr('src', item.media.posterDynamic)
//               imgContainer.append('<h5>' + item.name + '</h5>')
//               imgContainer.append(image)
//               imgContainer.append(mpaaRating)
             
//               criticReview.html("Critic Review").addClass("center-align")
//               userReview.html("User Review").addClass("center-align")
//               attachScore(criticReview, userReview, item.name)
//               reviewHeader.append(criticReview)
//               reviewHeader.append(userReview)
//               imgContainer.append(reviewHeader)

//               for (var i = 1; i < 4; i++) {
//                 var individualTheater = $('<div>').addClass("col s3")
//                 individualTheater.html("<h5>Theater " + i + "</h5>")
//                 theaterListing.append(individualTheater)
//               } 
              
//               for (var i = 1; i < 4; i++) {
//                 var theaterPreferencesBucket = $('<div>').addClass("col s3 grey darken-3 theater-pref-div")
//                 var purchaseButton = $('<input type="button" value="Purchase"/>').addClass("red lighten-1 btn-small purchase-btn")
//                 purchaseButton.attr('onclick', generatePurchaseLink(item.name, item.id, "amc-metreon-16"));
//                 theaterPreferencesBucket.text("Preferences Listing " + i)
//                 theaterPreferencesBucket.append(purchaseButton)
//                 theaterPreferencesContainer.append(theaterPreferencesBucket)
//               } 

//               textContainer.append(emptyRow)
//               textContainer.append(theaterListing).addClass("center-align")
//               textContainer.append(theaterPreferencesContainer).addClass("center-align")

//               newRow.append(emptyCol)
//               newRow.append(imgContainer)
//               newRow.append(textContainer)
//               newRow.append('<hr class="movie-page-hr-break">')

//               console.log(item.id);
//               console.log(item.name);
//               console.log(item.media.posterDynamic);
//               $('.movie-container').append(newRow)

//             });
//          }
//       });

//Set Ajax to GET movie and theater data (deprecated)



//API call to metacritic API to pull critic and user reviews

var metaCriticQueryURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/search/";
var metaCriticMovieURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/movie";

function attachScore(criticScore, userScore, filmName){
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
      if (response[0].Rating == null){
        criticScore.append("<br><h7> Score Unavailable </h7>")
        userScore.append("<br><h7> Score Unavailable </h7>")
        return;
      }

      if (response[0].Rating.CriticRating == null)
      {
        criticScore.append("<br><h7> Score Unavailable </h7>")
      } else {
        filmScoreNum = response[0].Rating.CriticRating;
        criticScore.append("<br><h6>" + parseInt(filmScoreNum) + "/100 </h6>");
      }

      if (response[0].Rating.UserRating == null){
        userScore.append("<br><h7> Score Unavailable </h7>")
      } else {
        userScoreNum = response[0].Rating.UserRating;
        userScore.append("<br><h6>" + userScoreNum + "/10</h6>")
      }
      // console.log("Score : " + filmScoreNum)
      }
  });
}
