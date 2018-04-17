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

  for (var i = 0; i < stateArr.length; i++) {
    var stateOption = $('<option>').val(stateArr[i])
    stateOption.text(stateArr[i])
    $(".state-picker").append(stateOption)
  }

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
