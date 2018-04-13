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