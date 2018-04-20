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

if(key !== null){  
    function getUser(key){
      return new Promise(function(resolve, reject) {
        var ref = firebase.database().ref('users/' + key)

        ref.on('value', function(snapshot) {
          sv = snapshot.val()
          user_theaters = sv.user_theatres
          user_preferences = sv.user_preferences

          resolve(true)  
        })    
      })
    }

    getUser(key)
      .then(function(valid) {
        if (valid) {
          // console.log('resolved')
          function getMovieDB(){
            return new Promise(function(resolve, reject){
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
                var criticReview = $('<div>').addClass("col s4 grey darken-2 reviews-div")
                var userReview = $('<div>').addClass("col s4 grey darken-2 reviews-div")
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
                  var individualTheater = $('<div>').addClass("col s3 theater-name")
                  individualTheater.attr('id', "_theater_" + i)
                  individualTheater.addClass("theater" + i)
                  individualTheater.html("<h5>Theater " + i + "</h5>")
                  theaterListing.append(individualTheater)
                } 
                

                // console.log(user_theaters)
                for (var i = 1; i < 4; i++) {
                  var niceMovieName = item.name.toLowerCase();
                  niceMovieName = niceMovieName.replace(/ /g , "-")
                  niceMovieName = niceMovieName.replace(/'/g,"-")

                  var niceTheaterName = user_theaters[i-1].name.toLowerCase();
                  niceTheaterName = niceTheaterName.replace(/ /g , "-")
                  niceTheaterName = niceTheaterName.replace(/'/g,"-")
                  
                  var theaterPreferencesBucket = $('<div>').addClass("col s3 grey darken-2 theater-pref-div")
                  theaterPreferencesBucket.attr('id', niceMovieName + "_theater_" + user_theaters[i-1].id)
                  theaterPreferencesBucket.addClass("theaterDiv" + i)
                  var purchaseButton = $('<input type="button" value="Purchase"/>').addClass("red lighten-1 btn-small purchase-btn")
                  purchaseButton.attr('onclick', generatePurchaseLink(item.name, item.id, niceTheaterName));
                  theaterPreferencesBucket.html("<h6>Available Amenities</h6><br>")
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

                $('.movie-container').append(newRow)

                $(".theater1").html("<h5>" + user_theaters[0].name + "</h5>")
                $(".theater2").html("<h5>" + user_theaters[1].name + "</h5>")
                $(".theater3").html("<h5>" + user_theaters[2].name + "</h5>")

                resolve(true)
              })
            })
          }

          getMovieDB()
            .then(function(valid){
              if(valid){
                //Iterate over all movies
                for (var i = 0; i < numMovies; i++){
            
                  var niceMovieName = moviesArr[i].toLowerCase();
                  niceMovieName = niceMovieName.replace(/ /g , "-")
                  niceMovieName = niceMovieName.replace(/'/g,"-")

                  //Iterate over theaters
                  for (var j = 1; j <= user_theaters.length; j++){

                    var req = $.ajax({
                       url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/" +
                       user_theaters[j-1].id + "/movies/" + movieIDArr[i] + "/earliest-showtime",
                       headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
                       type: "GET"
                    }).done(function (resp){

                      var workingMovieID = resp.theatreId

                      var workingMovieVar = resp.movieName.toLowerCase()
                      workingMovieVar = workingMovieVar.replace(/ /g, "-")
                      workingMovieVar = workingMovieVar.replace(/'/g, "-")
                    
                      $.each(resp.attributes,function(index,item){
                        var prefChecker = item.code.toLowerCase()

                        for (var k = 0; k < user_preferences.length; k++){
                          if (user_preferences[k] === prefChecker) {
                            // $("#" + workingMovieVar + "_theater_" + workingMovieID).append(user_preferences[k] + "<br><br>")
                            var buildID = workingMovieVar + "_theater_" + workingMovieID

                              var reservedIcon = $('<img>')
                              reservedIcon.height(60).width(60).attr("src","assets/images/reserved.png");
                              reservedIcon.addClass("reservedseating")

                              var alcoholIcon = $('<img>')
                              alcoholIcon.height(60).width(60).attr("src","assets/images/alcohol.png");
                              alcoholIcon.addClass("alcoholcardingpolicy")

                              var closedCaptionIcon = $('<img>')
                              closedCaptionIcon.height(50).width(60).attr("src","assets/images/closed-caption.png");
                              closedCaptionIcon.addClass("closedcaption")

                              var imax3DIcon = $('<img>')
                              imax3DIcon.height(30).width(30).attr("src","assets/images/3d.png");
                              imax3DIcon.addClass("imax3d")

                              var imaxIcon = $('<img>')
                              imaxIcon.height(30).width(60).attr("src","assets/images/imax-logo.png");
                              imaxIcon.addClass("imax")

                              var realD3dIcon = $('<img>')
                              realD3dIcon.height(20).width(60).attr("src","assets/images/reald-3d-logo.png");
                              realD3dIcon.addClass("reald3d")

                              var recliningSeatIcon = $('<img>')
                              recliningSeatIcon.height(60).width(60).attr("src","assets/images/reclining-seat-logo.png");
                              recliningSeatIcon.addClass("reclinerseating")

                              if (user_preferences[k] === "reservedseating") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(reservedIcon) 
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>") 
                              }

                              if (user_preferences[k] === "alcoholcardingpolicy") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(alcoholIcon) 
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>") 
                              }

                              if (user_preferences[k] === "closedcaption") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(closedCaptionIcon) 
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>") 
                              }

                              if (user_preferences[k] === "imax3d") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(imaxIcon)
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>")  
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(imax3DIcon)
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>")  
                              }

                              if (user_preferences[k] === "imax") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(imaxIcon)
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br><br>")   
                              }

                              if (user_preferences[k] === "reald3d") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(realD3dIcon) 
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>") 
                              }

                              if (user_preferences[k] === "reclinerseating") {
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append(recliningSeatIcon)
                                $("#" + workingMovieVar + "_theater_" + workingMovieID).append("<br>")  
                              }
                          }
                        }
                      })
                    })
                  }
                }
              }
            }).fail(function(jqXHR, status){
              console.log("Fail" + jqXHR);
              return;
            })
          }
        })         
} else {
  console.log("Null Key!  No user!")
}

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

  return `window.location.href='${href}'`;
}

// Call to users local theaters to check for matching "preferences" (attribute.codes)
$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/4145/showtimes/" + todaysDate,
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 

            $.each(response._embedded.showtimes,function(index,item){
            });
         }
      });

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
      }
  });
}
