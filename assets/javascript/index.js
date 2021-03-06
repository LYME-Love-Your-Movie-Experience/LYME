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

var database =  firebase.database()

//Delete all current movies in the /movies/ DB
database.ref('/movies/').remove()

//API call to AMC to pull all currently playing movies and push them to the DB
$.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/movies/views/now-playing",
         headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
         type: "GET",
         success: function(response) { 
            // console.log(response.Runtime);
            $.each(response._embedded.movies,function(index,item){
              var movieID = item.id
              var movieName = item.name
              var movieRating = item.mpaaRating
              var moviePoster = item.media.posterDynamic

              if(movieRating === undefined){
                movieRating = 'N/A'
              }
              var newMovie = {name: movieName, id: movieID, rating: movieRating, poster: moviePoster}
              database.ref('/movies/').push(newMovie)
              
              // console.log(item.id);
              // console.log(item.name);
              // console.log(item.mpaaRating);
              // console.log(item.media.posterDynamic)
            })
          }
        })
$(document).ready(function(){
    $('#modal1').modal();
});

$(document.body).on('click', '#submit_button', function(event){
  event.preventDefault()

  var email = $('#user_email').val()

  function getUser(email){
      return new Promise(function(resolve, reject) {
        var ref = firebase.database().ref('users/')
        ref.orderByChild('email').equalTo(email).once('value', function(snapshot) {
          var sv = snapshot.val()
          if(sv !== 'null'){
            localStorage.setItem('key', Object.keys(sv)[0])
            resolve(true)
          }else{
            resolve(false)
          }  
        })    
      })
    }

    getUser(email)
      .then(function(valid) {
        if (valid) {
          window.location = 'movies.html'
        }else{
          $('#user_email').val('Email not attached to an existing account')
        }
      })
})

$(document.body).on('click', '#user_email', function(event){
  $('#user_email').val('')
})

$(document.body).on('click', '#account_creation_btn', function(event) {
  event.preventDefault()
  window.location = 'account.html'
})
