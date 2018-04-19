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
  constructor(first_name, last_name, email, city, state, user_preferences, user_theatres){
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.city = city;
    this.state = state;
    this.user_preferences = user_preferences
    this.user_theatres = user_theatres
  }
}
// Build this URL with the user's data
var userURL = ""

// Create AMC API call to get list of AMC theaters
// Example of a theater query "theatres?state=california&city=san-francisco"
var queryURL = "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/";

$(document).ready(function(){
  $('#success-modal').modal();
  $('#help-modal').modal();
  $('#help-modal').modal('open');

  // console.log(localStorage.getItem('key'))
  const TO_NAME = 1;
  const TO_ABBREVIATED = 2;
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
    // console.log('state')
  }

  //Customer preference options
  theatrePreferenceArr = ['IMAX','IMAX 3D', 'REALD 3D', 'Reserved Seating', 'Closed Caption', 'Reclining Seats', 'Alcohol']
  // moviePreferenceArr = ['Action','Adventure','Animation','Comedy','Documentary','Drama','Fantasy',
  //   'Film Festival','Family','Musical','Romantic Comedy','Science Fiction','Suspense','Western']

  //populate preferences buttons
  populateOptions(theatrePreferenceArr)
  // populatePersonalPreferenceButtons(moviePreferenceArr)

  $(document.body).on('click', '.validate', function(){
    $(this).val('')
  })

  var key = localStorage.getItem('key')
  
  if(key !== null){  
    console.log(key, typeof key)
    function getUser(key){
      return new Promise(function(resolve, reject) {
        var ref = firebase.database().ref('users/' + key)
        console.log(ref)
        console.log('about to query')
        ref.on('value', function(snapshot) {
          console.log(snapshot.val())
          resolve(true)  
        })    
      })
    }

    getUser(key)
      .then(function(valid) {
        if (valid) {
          console.log('resolved')
        }
      })
  }else{

  }

  //Real time update of preferences array as the user clicks the checkboxes
  // $(document.body).on('click', '.pref', function(){
  //   var state = ($(this).attr('state') === 'true')
  //   var curPref = $(this).siblings('.pref_label').text()

  //   if(state){
  //     preferenceCount--

  //     var index = preferences.indexOf(curPref)
  //     preferences.splice(index,1)
  //     $(this).attr('state', false)
  //   }else{
  //     preferenceCount++

  //     if(preferenceCount === 4){
  //       event.preventDefault()
  //       preferenceCount = 3
  //       return
  //     }

  //     preferences.push(curPref)
  //     $(this).attr('state', true)
  //   }
  // })

  //Event handler for new user submition
  $(document.body).on('click','#account-btn-mod', function(event){
    event.preventDefault()

    //Grab new user input fields from form
    var firstName = $('#first_name').val().trim()
    var lastName = $('#last_name').val().trim()
    var email = $('#email').val().trim()
    var city = $('#city_name').val().trim()
    var state = $('#state-picker').val().trim().toUpperCase()

    var preferenceOne = $('#preference_one').val()
    var preferenceTwo = $('#preference_two').val()
    var preferenceThree = $('#preference_three').val()

    preferences.push(preferenceOne)
    preferences.push(preferenceTwo)
    preferences.push(preferenceThree)

    for(var i = 0; i< preferences.length; i++){
      if(preferences[i] === 'IMAX'){
        preferences[i] = 'imax'
      }
      if(preferences[i] === 'IMAX 3D'){
        preferences[i] = 'imax3d' 
      }
      if(preferences[i] === 'REALD 3D'){
        preferences[i] = 'reald3d'
      }
      if(preferences[i] === 'Reserved Seating'){
        preferences[i] = 'reservedseating'
      }
      if(preferences[i] === 'Closed Caption'){
        preferences[i] = 'closedcaption'
      }
      if(preferences[i] === 'Reclining Seats'){
        preferences[i] = 'reclinerseating'
      }
      if(preferences[i] === 'Alcohol'){
        preferences[i] = 'alcoholcardingpolicy'
      }
    }
    //Check all fields are populated, if not run exception functions, add to exception counter
    if(first_name === ''){
      nameEmptyException()
      exceptionCount++
    }
    if(last_name === ''){
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

    userURL = buildAMCMovieQuery(city,state)
    var user_theatres = []

    function getTheatres(city, state){
      return new Promise(function(resolve, reject){
        $.ajax({
          url: queryURL + userURL,
          headers: {"X-AMC-Vendor-Key":"3E9F23B5-8BE9-4DD1-854D-204A9F3138FB"},
          type: "GET",
          success: function(response) { 
            $.each(response._embedded.theatres,function(index,item){
              var newTheatre = {id: item.id, name: item.longName}
              user_theatres.push(newTheatre)
            })
            if(user_theatres.length > 0){
              resolve(true)
            }else{
              resolve(false)
            }
          }
        })
      })
    }

    getTheatres(city, state)
      .then(function(valid){
        console.log(valid, 'doing this before checkEmail')

        function checkEmail(email){
          return new Promise(function(resolve, reject) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(re.test(String(email).toLowerCase())){
                var ref = firebase.database().ref('/users/');        
                ref.orderByChild('email').equalTo(email).once('value', function(snapshot) {
                  const response = snapshot.numChildren()
                  console.log("This should be before promise",response)
                  if(response > 0){
                    resolve(true)
                  }
                  else {
                    resolve(false)
                  }
                  // return false  
                })
               
              } 
          })
        }

        checkEmail(email)
          .then(function(valid) {
            console.log(valid)
            if(valid){
              exceptionCount++
            }

            if(exceptionCount > 0){
              exceptionCount = 0
              return
            }

            //Make newUser object from inputs
            var newUser = new user(firstName, lastName, email, city, state, preferences, user_theatres)

            //Clear out all fields
            $('#first_name').val('')
            $('#last_name').val('')
            $('#email').val('')
            $('#city_name').val('')
            $('#state-picker').val('')

            //Push newUser object to firebase users node, make reference of it
            var newUserRef = database.ref('/users/').push(newUser)

            //Set local storage key, to the node key in the database, so we can access their preferences later
            localStorage.setItem('key', newUserRef.key)

            window.location = 'movies.html'
          })
    })
  })




    

  // function validateEmail(email) {
  //   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
  //   if(re.test(String(email).toLowerCase())){
  //       var ref = firebase.database().ref('/users/');        
  //       ref.orderByChild('email').equalTo(email).once('value', function(snapshot) {
  //         const response = snapshot.numChildren()
  //         console.log("This should be before promise",response)
  //         if(response > 0){
  //           console.log('returning false')
  //           return true
  //         }
  //         console.log('returning true')
  //         return false  
  //       })
       
  //     } 
  // }

  function populateOptions(array){
    var count = array.length

    for (var i = 0; i < count; i++) {
      // console.log('making options')
      var label = $('<option>').val(array[i])
      label.addClass('pref_label')
      label.text(array[i])

      $('#preference_one').append(label)

    }
    $('#preference_one').children('.pref_label').clone().appendTo('#preference_two')
    $('#preference_one').children('.pref_label').clone().appendTo('#preference_three')
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


  function convertRegion(input, to) {
    var states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Armed Forces Americas', 'AA'],
        ['Armed Forces Europe', 'AE'],
        ['Armed Forces Pacific', 'AP'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Northern Mariana Islands', 'NP'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    // So happy that Canada and the US have distinct abbreviations
    var provinces = [
        ['Alberta', 'AB'],
        ['British Columbia', 'BC'],
        ['Manitoba', 'MB'],
        ['New Brunswick', 'NB'],
        ['Newfoundland', 'NF'],
        ['Northwest Territory', 'NT'],
        ['Nova Scotia', 'NS'],
        ['Nunavut', 'NU'],
        ['Ontario', 'ON'],
        ['Prince Edward Island', 'PE'],
        ['Quebec', 'QC'],
        ['Saskatchewan', 'SK'],
        ['Yukon', 'YT'],
    ];

    var regions = states.concat(provinces);

    var i; // Reusable loop variable
    if (to == TO_ABBREVIATED) {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < regions.length; i++) {
            if (regions[i][0] == input) {
                return (regions[i][1]);
            }
        }
    } else if (to == TO_NAME) {
        input = input.toUpperCase();
        for (i = 0; i < regions.length; i++) {
            if (regions[i][1] == input) {
                return (regions[i][0]);
            }
        }
    }
  }

  function buildAMCMovieQuery(city, state){
    var theaterQuery = "theatres?"

    var queryState = convertRegion(state, TO_NAME);
    queryState = queryState.toLowerCase();
    queryState = queryState.replace(/ /g , "-");

    var userCity = city.toLowerCase();
    userCity = userCity.replace(/ /g , "-");

    theaterQuery += "state=" + queryState;
    theaterQuery += "&city=" + userCity;

    return theaterQuery;
  }
})

$(document.body).on('click', '#redirect_button', function(event) {
  event.preventDefault()
  window.location = 'movies.html'
})