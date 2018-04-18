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

  $(document.body).on('click', '.validate', function(){
    $(this).val('')
  })

  //Real time update of preferences array as the user clicks the checkboxes
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
      stateCodeException()
      exceptionCount++
    }

    // Promise
    var queryAsk = new Promise(
        function (resolve, reject) {
            resolve (validateEmail(email))
    })

    var queryResponse = function () {
      console.log('Promise runs')
      queryAsk
        .then(function (fulfilled) {
            // if()
            console.log(fulfilled)
            exceptionCount++

            if(exceptionCount > 0){
              exceptionCount = 0
              return
            }

            //Make newUser object from inputs
            var newUser = new user(name, email, city, state, preferences)

            //Clear out all fields
            $('#name').val('')
            $('#email').val('')
            $('#city').val('')
            $('#state').val('')

            console.log('shouldnt have gotten here', exceptionCount)
            //Push newUser object to firebase users node, make reference of it
            var newUserRef = database.ref('/users/').push(newUser)

            //Set local storage key, to the node key in the database, so we can access their preferences later
            localStorage.key = newUserRef.key

            // window.location = 'movies.html'
        })
        .catch(function (error) {
            console.log(error);
        })
    }
  })

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(re.test(String(email).toLowerCase())){
        var ref = firebase.database().ref('/users/');
        ref.orderByChild('email').equalTo(email).once('value', function(snapshot) {
          const response = snapshot.numChildren()
          console.log("This should be before promise",response)
          if(response > 0){
            console.log('returning true')
            return true
          }
          return false  
        })
       
      } 
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

  function emailExistsException(){
    var email = $('#email')
    var label = $('#email-label')

    label.addClass('active')
    email.css('color', '#00c853')
    email.val('That email address is already linked to another account') 
  }

  function nameEmptyException(){
    var name = $('#name')
    var label = $('#name-label')

    label.addClass('active')
    name.css('color', '#00c853')
    name.val('Please input your name')
  }

  function emailEmptyException(){
    var email = $('#email')
    var label = $('#email-label')

    label.addClass('active')
    email.css('color', '#00c853')
    email.val('Please input a valid email address')
  }

  function cityEmptyException(){
    var city = $('#city')
    var label = $('#city-label')

    label.addClass('active')
    city.css('color', '#00c853')
    city.val('Please input your city of residence')
  }

  function stateEmptyException(){
    var state = $('#state')
    var label = $('#state-label')

    label.addClass('active')
    state.css('color', '#00c853')
    state.val('Please input your state of residence')
  }

  function stateCodeException(){
    var state = $('#state')
    var label = $('#state-label')

    label.addClass('active')
    state.css('color', '#00c853')
    state.val('Please input a valid two character state code')
  }

  function cityStateException(){
    var city = $('#city')
    var label = $('#city-label')

    label.addClass('active')
    city.css('color', '#00c853')
  }

  // function setCookie(key, exdays) {
  //   console.log('here')
  //   var d = new Date();
  //   d.setTime(d.getTime() + (exdays*24*60*60*1000));
  //   var expires = "expires="+ d.toUTCString();
  //   document.cookie = "name=" + key
  // }

  // function getCookie(name) {
  //   var foo = name + "=";
  //   var decodedCookie = decodeURIComponent(document.cookie);
  //   console.log(decodedCookie)
  //   var ca = decodedCookie.split(';');
  //   for(var i = 0; i <ca.length; i++) {
  //       var c = ca[i];
  //       while (c.charAt(0) == ' ') {
  //           c = c.substring(1);
  //       }
  //       if (c.indexOf(foo) == 0) {
  //           return c.substring(foo.length, c.length);
  //       }
  //   }
  //   return "";
  // }
})
