// Requierd modules
require("dotenv").config(); //Dotenv helps on retrieving environment variables.

var request = require('request');  //require request npm..for movies
var keys = require('./keys.js');  //require keys.js file..for authentication details
var Spotify = require('node-spotify-api');  //require spotify npm..for songs
var moment = require('moment');  //require moment npm..
var fs = require('fs')  //fs package to read from text file
var cTable = require('console.table');



var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});


if (process.argv[2] == 'concert-this' ) {
  var artist = process.argv.slice(3).join(" ")
  console.log(artist);


  //run request to bandsintown with the specified artist
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  request(queryURL, function (error, response, body) {
    if(error) console.log(error);
    var result = JSON.parse(body)[0];

    //get venue name
    console.log("Venue name " + result.venue.name);
    //get venue location
    console.log("Venue location " + result.venue.city);
    //get date of event
    console.log("Date of Event " + moment(result.datetime).format("MM/DD/YYYY"));
    
  });

} else if (process.argv[2] == 'spotify-this-song'){

  var songName = process.argv.slice(3).join(" ");

  if (songName == undefined) {
      songName= "I Wanna Dance With Somebody";
  }

  spotify.search({ type: 'track', query: songName, limit:10 }, function(err,data){
    if (err) {
      return console.log('error occurred: '+ err);
    }
    var tableArray = [];

    //loop through all the "items" array
    for (var i = 0; i < data.tracks.items.length; i++) {
      var result = {
        artist : data.tracks.items[i].album.artists[0].name,
        album_name : data.tracks.items[i].album.name,
        song_name : data.tracks.items[i].name,
        preview_url : data.tracks.items[i].preview_url,
      }

      tableArray.push(result);
  }
  var table = cTable.getTable(tableArray);
  console.log(table);

});


//if no song is provided then your program will default to "I Wanna Dance With Somebody"
}else if (process.argv[2] == 'movie-this'){
  var movieName = process.argv.slice(3).join(" ");
  if (movieName == undefined) {
      movieName= "Mr.Nobody";
  }
  //request to OMDB
  request('https://www.omdbapi.com/?i=tt3896198&apikey=OMDBKEY&t' + process.argv[3],function (error, response, body) {

    var result = JSON.parse(body);
    console.log("Title: " + result.Title);
    console.log("Release Year: " + result.Year);
    console.log("IMDB Rating: " + result.imdbRatings);
    console.log("Rotten Tomatoes: " + result.Ratings[1].Value);
    console.log("Country: " + result.Country);
    console.log("Language: " + result.Language);
    console.log("Plot: " + result.Plot);
    console.log("Actors: " + result.Actors);
    
  });

} else if (process.argv[2] == 'do-what-it-says'){
  console.log ('do-what-it-says')

}

