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
  constructor(name, age, email, preferences, city, state){
    this.name = name;
    this.age = age;
    this.email = email;
    this.preferences = preferences;
    this.city = city;
    this.state = state;
  }
}

$(document).ready(function(){
  var name = ''
  var email = ''
  var age = ''
  var city = ''
  var state = ''
  var zipcode = 00000

  //Customer preferences
  theatrePreferenceArr = ['IMAX', 'Recliner Seating', 'Love Seats', 'Reserved Seating','Alchohol for Sale','Concession Delivery','3D','Loyalty Cards']
  moviePreferenceArr = ['Action','Adventure','Animation','Comedy','Documentary','Drama','Fantasy','Film Festival','Family','Musical','Romantic Comedy','Science Fiction','Suspense','Western']

  //populate preferences buttons
  populatePreferenceButtons(theatrePreferenceArr)
  populatePersonalPreferenceButtons(moviePreferenceArr)

  $(document.body).on('click','#submit', function(event){
    event.preventDefault()

    // database.ref().push{

      // name: name
      // email: email
      // age: age
      // city: city
      // state: state

    // }
  })

  function populatePreferenceButtons(array){
    var count = array.length

    for (var i = 0; i < count; i++) {
      var label = $('<label>')
      var checkbox = $('<input type="checkbox" class="filled-in" checked="checked" id="preference-' + i +'">')
      var span = $('<span>')

      span.text(array[i])
      label.append(checkbox).append(span)

      $('#theatre-preferences').append(label)
    }
  }

  function populatePersonalPreferenceButtons(array){
    var count = array.length

    for (var i = 0; i < count; i++) {
      var label = $('<label>')
      var checkbox = $('<input type="checkbox" class="filled-in" checked="checked" id="preference-' + i +'">')
      var span = $('<span>')

      span.text(array[i])
      label.append(checkbox).append(span)

      $('#movie-preferences').append(label)
    }
  }
})

//AJAX Call to AMC to GET list of Theaters by City and State (set item.id and item.longName of theater)
var queryURL = "https://cors-anywhere.herokuapp.com/https://api.amctheatres.com/v2/";

$.ajax({
         url: queryURL + "theatres?state=california&city=san-francisco",
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

