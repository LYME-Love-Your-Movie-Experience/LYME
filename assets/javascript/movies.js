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
            var divContainer = $('<div>');
            $.each(response._embedded.movies,function(index,item){
              var image = $('<img>')
              image.attr('src', item.media.posterDynamic)
              divContainer.append(image)
              console.log(item.id);
              console.log(item.name);
              console.log(item.media.posterDynamic);

            });
            $('body').append(divContainer)
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

//Generate Link to purchase tickets at website

$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/theatres/4145/showtimes/4-14-18",
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            console.log(response);
            console.log(response.Runtime);
            $.each(response._embedded.showtimes,function(index,item){
              console.log(item.attributes.code);
              console.log(item.movieId);
            });
         }
      });

//https://www.amctheatres.com/movies/ready-player-one-48972/showtimes/ready-player-one-48972/2018-04-14/amc-metreon-16/all
var movieId
var movieTitle
var todaysDate
var theatreLongName
var href


href = "http://www.amctheaters.com/movies/" + "movieTitle" + "-" + "movieId" + "/showtimes" +
       "movieTitle" + "-" + "movieId" + "todaysDate" + "theatreLongName" + "/all"

//Original Code

var metaCriticQueryURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/search/";
var metaCriticMovieURL = "https://cors-anywhere.herokuapp.com/https://api-marcalencc-metacritic-v1.p.mashape.com/movie";

//filmName = Ready Player One

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