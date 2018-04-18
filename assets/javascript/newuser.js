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
  constructor(first_name, last_name, email, city, state, user_preferences){
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.city = city;
    this.state = state;
    this.user_preferences = user_preferences
  }
}


$(document).ready(function(){
  // console.log(localStorage.getItem('key'))

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

    // Promise
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
        var newUser = new user(firstName, lastName, email, city, state, preferences)

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

        // window.location = 'movies.html'
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

  // function populatePersonalPreferenceButtons(array){
  //   var count = array.length

  //   for (var i = 0; i < count; i++) {
  //     var label = $('<label>')
  //     var checkbox = $('<input type="checkbox" class="filled-in preference" state="false" id="preference-' + i +'">')
  //     var span = $('<span class="pref_label">')

  //     span.text(array[i])
  //     label.append(checkbox).append(span)

  //     $('#preference_one').append(label)
  //     $('#preference_two').append(label)
  //     $('#preference_three').append(label)

  //   }
  // }

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

})

$(document.body).on('click', '#redirect_button', function(event) {
  event.preventDefault()
  window.location = 'movies.html'
})