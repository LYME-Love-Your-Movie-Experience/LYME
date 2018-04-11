//Theater Tickets App - Project 1

//Contributers
//Scott
//Jared
//Nathan
//Damian

//Set Firebase Database

//Set Ajax calls

//Create Variables

var name = "";
var email = "";
var phone = "";
var month = "";
var moviePoster = "";
var movieTitle = "";
var movieReleaseDate = "";
var movieReview = "";
var movieRadio = "";
var preferredTheater = "";
var preferredExperience = "";

//Create an array of Movie Images from NYT json response

//console.log($.getJSON("https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb"));


$('#term').focus(function(){
      var moviePoster = $("#poster").has("img").length ? true : false;
      if(moviePoster === false){
         $('#poster').empty();
      }
   });

   var getPoster = function(){

        var film = $('#term').val();
        console.log("success")

         if(film === ''){

            $('#poster').html('<div class="alert"><strong>Oops!</strong> Try adding something into the search field.</div>');

         } else {

            $('#poster').html('<div class="alert"><strong>Loading...</strong></div>');

            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?", function(json) {
              if (json !== "Nothing found."){                 
                console.log(json);
                $('#poster').html('<p>Your search found: <strong>' + json.results[0].title + '</strong></p><img src=\"http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '\" class=\"img-responsive\" >');
              } else {
                $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=avengers&callback=?", function(json) {
                       
                console.log(json);
                $('#poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><p>Perhaps you were looking for The Avengers?</p><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json[0].poster_path + ' class="img-responsive" />');
                    });
                  }
             });

          }

        return false;
   }

   $('#search').click(getPoster);
   $('#search').on('click', function() {
    console.log("success")
   })

   $('#term').keyup(function(event){
       if(event.keyCode === 13){
           getPoster();
       }
   });

//Create an array of Movie Titles from NYT json response

//Create an array of Movie Radio buttons to accompany movie title

//Create PUSH to build database when user creates account

//Create PULL to build users account page

//Create logic to set preferred theater

//Create logic to set preferred theater experience

//Send Email confirmation

// parameters: service_id, template_id, template_parameters
// emailjs.send("default_service","upcoming_movies",{name: "James", movieTitle: "The Avengers", preferredTheater: "AMC 16 Metreon", preferredExperience: "IMAX"});
