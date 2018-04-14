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

var database = firebase.database()

class user{
  constructor(name, email, city, state, user_preferences){
    this.name = name;
    this.email = email;
    this.city = city;
    this.state = state;
    this.user_preferences = user_preferences
  }
}

$(document).ready(function(){
  var preferences = []
  var preferenceCount = 0
  var exceptionCount = 0

  //Valid state codes
  var stateArr = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC",  
    "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA",  
    "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE",  
    "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",  
    "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

  //Customer preference options
  theatrePreferenceArr = ['IMAX', 'Recliner Seating', 'Love Seats', 'Reserved Seating','Alchohol for Sale','Concession Delivery','3D','Loyalty Cards']
  moviePreferenceArr = ['Action','Adventure','Animation','Comedy','Documentary','Drama','Fantasy',
    'Film Festival','Family','Musical','Romantic Comedy','Science Fiction','Suspense','Western']

  //populate preferences buttons
  populatePreferenceButtons(theatrePreferenceArr)
  populatePersonalPreferenceButtons(moviePreferenceArr)


  //Event handler for database update
  database.ref('/users/').on('child_added', function(snapshot){
    var sv = snapshot.val()

    var key = snapshot.key
    console.log(key)
  })

  //Event handler for new user submition
  $(document.body).on('click','#submit', function(event){
    event.preventDefault()

    //Grab new user input fields from form
    var name = $('#name').val().trim()
    var email = $('#email').val().trim()
    var city = $('#city').val().trim()
    var state = $('#state').val().trim().toUpperCase()

    //Check all fields are populated, if not run exception functions, add to exception counter
    if(name === ''){
      nameEmptyException()
      exceptionCount++
    }
    if(email === ''){
      emailEmptyException()
      exceptionCount++
    }
    if(city ===''){
      cityEmptyException()
      exceptionCount++
    }
    if(state === ''){
      stateEmptyException()
      exceptionCount++
    }

    //Check for valid state code, if not run exception, add to exception counter 
    if(stateArr.indexOf(state) < 0){
      citateException()
      exceptionCount++
    }

    if(exceptionCount > 0){
      exceptionCount = 0
      return
    }

    //Make newUser object from inputs
    var newUser = new user(name, email, city, state, preferences)

    //Push newUser object to firebase users node
    database.ref('/users/').push(newUser)
  })

  function nameEmptyException(){
  
  }

  function emailEmptyException(){
  }

  function cityEmptyException(){
  }

  function stateEmptyException(){
  }

  function stateCodeException(){

  }

  function cityStateException(){

  }

  function populatePreferenceButtons(array){
    var count = array.length

    for (var i = 0; i < count; i++) {
      var label = $('<label>')
      var checkbox = $('<input type="checkbox" class="filled-in preference" state="false" id="preference-' + i +'">')
      var span = $('<span class="pref_label">')

      span.text(array[i])
      label.append(checkbox).append(span)

      $('#theatre-preferences').append(label)
    }
  }

  function populatePersonalPreferenceButtons(array){
    var count = array.length

    for (var i = 0; i < count; i++) {
      var label = $('<label>')
      var checkbox = $('<input type="checkbox" class="filled-in preference" state="false" id="preference-' + i +'">')
      var span = $('<span class="pref_label">')

      span.text(array[i])
      label.append(checkbox).append(span)

      $('#movie-preferences').append(label)
    }
  }

  //real time update of preferences array as the user clicks the checkboxes
  $(document.body).on('click', '.preference', function(){
    var state = ($(this).attr('state') === 'true')
    var curPref = $(this).siblings('.pref_label').text()

    if(state){
      preferenceCount--

      var index = preferences.indexOf(curPref)
      preferences.splice(index,1)
      $(this).attr('state', false)
    }else{
      preferenceCount++

      if(preferenceCount === 4){
        event.preventDefault()
        preferenceCount = 3
        return
      }

      preferences.push(curPref)
      $(this).attr('state', true)
    }
  })
})

// TODO: update db reference with Nate's session data later
var ref = database.ref("/users/-LA4P1GT2KZM5tiRMNPI");

// Build this URL with the user's data
var userURL = ""

// Create AMC API call to get list of AMC theaters
// Example of a theater query "theatres?state=california&city=san-francisco"
function buildAMCMovieQuery(city, state){
  var theaterQuery = "theatres?"

  var queryState = convertRegion(state, TO_NAME);
  queryState = queryState.toLowerCase();
  queryState = queryState.replace(/ /g , "-");

  var userCity = city.toLowerCase();
  userCity = userCity.replace(/ /g , "-");

  theaterQuery += "state=" + queryState;
  theaterQuery += "&city=" + userCity;

  console.log(theaterQuery);
  return theaterQuery;
}

var queryURL = "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/";

// Should load user's data here, from ref var above
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
  userURL = buildAMCMovieQuery(snapshot.val().city,snapshot.val().state)

  //AJAX Call to AMC to GET list of Theaters by City and State (set item.id and item.longName of theater)
  $.ajax({
    // url: queryURL + "theatres?state=california&city=san-francisco",
    url: queryURL + userURL,
    headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
    type: "GET",
    success: function(response) { 
      console.log(response);
      console.log(response.Runtime);
      $.each(response._embedded.theatres,function(index,item){
        console.log(item.id);
        console.log(item.longName);
      });
    }
  });

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//AJAX GET call to AMC by theater ID to pull Prefered Experience (set attributes.item)
$.ajax({
  url: queryURL + "theatres/2325",
  headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
  type: "GET",
  success: function(response) { 
    console.log(response);
    console.log(response.Runtime);
    $.each(response.attributes,function(index,item){
      console.log(item.code);
    });
  }
});
