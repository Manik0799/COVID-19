//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const request = require("request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//////////////////////////////////


app.get("/", function(req, res){

  const urlTotalData= "https://corona.lmao.ninja/v2/all";

  request.get(urlTotalData, (error, response, body) =>{
    let json= JSON.parse(body);
    res.render("home", {totalData: json});
  });


});

//////////////////////////////////



app.post("/", function(req, res){

// Getting country code from the country name input by user
  let countryName= req.body.country;
  const url1= "https://api-2445580194301.production.gw.apicast.io/1.0/region/country/code.php?value="+ countryName +"&app_id=5949a101&app_key=demokey";

  request.get(url1, (error, response, body) => {

    let json = JSON.parse(body);

    let countryCode= json["ISO ALPHA-2"];
     // Waiting for the country code and getting corona data from the country code

     if(countryCode){

       const url2= "https://corona-api.com/countries/" + countryCode;
       request.get(url2, (error, response, body) => {
         let coronaData = JSON.parse(body);

         // Got the data in an object passing it to display Info Page
         res.render("displayInfo", {countryCoronaData: coronaData, code: countryCode});
       });
     } else{
       res.render("notFound");
     }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
