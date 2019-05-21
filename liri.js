require("dotenv").config();
//var to access range of keys
var keys = require("./keys.js");
//OMBD key - axios access
var axios = require("axios");
//Spotify keys
var Spotify = require("node-spotify-api");
var spotifyThis = new Spotify(keys.spotify);
//moment key
var moment = require("moment");
var fs = require("fs");

//****************************************************************
//COMMANDS TO RUN: `movie-this`|`spotify-this-song`|`concert-this`
//****************************************************************
//arguements
var userRequest = process.argv[2];
var queryRequest = process.argv[3];

// console.log(userRequest);
// console.log(queryRequest);

function pickCommand(userRequest, queryRequest) {
  //`movie-this`
  if (userRequest === "movie-this") {
    movieThis(queryRequest);
  }//`spotify-this-song`
  else if (userRequest === "spotify-this-song") {
    spotifyThisSong(queryRequest);
  }//`concert-this`
  else if (userRequest === "concert-this") {
    concertThis(queryRequest);
  } //`do-what-it-says`
  else if (userRequest === "do-what-it-says") {
    doWhatItSays(queryRequest);
  }
}
pickCommand(userRequest, queryRequest);

//*****************************
//`movie-this` // OMBD COMMAND
//*****************************
//concatenate request w/ axios to queryURL
function movieThis(queryRequest) {
  //run request axios - OMBD
  var queryURL = "http://www.omdbapi.com/?t=" + queryRequest + "&y=&plot=short&apikey=trilogy";
  //run request axios - queryURL
  axios.get(queryURL).then(function (apiResponse) {
    console.log(
      "Title: " + apiResponse.data.Title + "\n",
      "IMDB Rating: " + apiResponse.data.imdbRating + "\n",
      "Rotten Tomatoes Rating: " + apiResponse.data.Ratings[1].Value + "\n",
      "Country Produced: " + apiResponse.data.Country + "\n",
      "Language: " + apiResponse.data.Language + "\n",
      "Plot: " + apiResponse.data.Plot + "\n",
      "Actors: " + apiResponse.data.Actors + "\n"

      //OR another example - this is for PRACTICE 

      // console.log(`
      //   Title: ${apiResponse.data.Title},
      //   IMDB Rating: ${apiResponse.data.imdbRating},
      //   Rotten Tomatoes Rating: ${apiResponse.data.Ratings[1].Value},
      //   Country Produced: ${apiResponse.date.Country},
      //   Language: ${apiResponse.data.Language},
      //   Plot: ${apiResponse.data.Plot},
      //   Actors: ${apiResponse.data.Actors}`);
    );
  });
}

//sans movie title, then output 'Mr. Nobody'
if (queryRequest === "Mr. Nobody" && userRequest === "movie-this") {
  console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/");
  console.log("It's on Nextflix!");
}

//***************************************
//`spotify-this-song` // SPOTIFY COMMAND
//***************************************
//concatenate request w/ Spotify to queryURL
function spotifyThisSong(queryRequest) {
  //sans song search, then output 'The Sign by Ace of Base'
  if (queryRequest === undefined) {
    queryRequest = "The Sign Ace of Base";
  }

  spotifyThis
    .search({ type: 'track', query: queryRequest, limit: 1 })
    .then(function (apiResponse) {
      console.log(`
        Artist: ${apiResponse.tracks.items[0].artists[0].name},
        Album: ${apiResponse.tracks.items[0].album.name},
        Song Name: ${apiResponse.tracks.items[0].name},
        Preview: ${apiResponse.tracks.items[0].preview_url}
        `);
    })
    .catch(function (err) {
      console.log(err);
    });
}

//**************************************
//`concert-this` // BANDSINTOWN COMMAND
//**************************************
function concertThis(queryRequest) {
  //run request 
  var queryEvents = "https://rest.bandsintown.com/artists/" + queryRequest + "/events?app_id=codingbootcamp";
  axios.get(queryEvents).then(function (apiResponse) {
    apiResponse.data.forEach(function (event) {
      console.log("Venue Name: " + event.venue.name);
      console.log("Venue Location: " + event.venue.city);
      //dates: use moment to format this as "MM/DD/YYYY"  
      console.log("Event Date: " + moment(event.datetime).format("MM/DD/YYYY"));
      // console.log(event.venue.name);
      console.log('\n\n');
    })
  });
}

//********************************************
//`do-what-it-says` // COMMAND LINE ARGUMENTS
//********************************************
function doWhatItSays(userRequest, queryRequest) {

  fs.readFile("random.txt", "UTF-8", function (err, data) {

    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return;
    }
    var dataArr = data.split(",");
    var userRequest = dataArr[0].trim();
    var queryRequest = dataArr[1].trim();

    doWhatItSays(userRequest, queryRequest);
  });
}
