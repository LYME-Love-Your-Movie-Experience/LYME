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
  constructor(name, age, email, preferences){
    this.name = name;
    this.age = age;
    this.email = email;
    this.preferences = preferences;
  }
}

$(document).ready(function(){
  var name = ''
  var email = ''
  var age = ''
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
