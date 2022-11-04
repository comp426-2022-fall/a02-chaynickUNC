#!/usr/bin/env node
import minimist from "minimist"
import moment from "moment-timezone";
import fetch from "node-fetch";

var argv = minimist(process.argv.slice(2));
const timezone = moment.tz.guess();

if(argv["h"]){ 
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -z            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}
if(argv["j"]){
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=35.875&longitude=-79&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&timezone=America%2FNew_York");
    const data = await response.json();
    console.log(data);
    process.exit(0);
}

const today = new Date();
var future = new Date();
var url = "https://api.open-meteo.com/v1/forecast?";

if(argv["n"] || argv["s"]){ url += (argv["s"]) ? `latitude=${-argv["s"]}&` : `latitude=${argv["n"]}&` }
if(argv["e"] || argv["w"]){ url += (argv["w"]) ? `longitude=${-argv["w"]}&` : `longitude=${argv["e"]}&` }
if(argv["z"]){ url += `timezone=${argv["z"]}&` }
else { url += `timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&`; }

//url += `start_date=${`${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`}&end_date=${`${future.getFullYear()}-${("0" + (future.getMonth() + 1)).slice(-2)}-${("0" + future.getDate()).slice(-2)}`}&daily=precipitation_hours&current_weather=true`

url += `daily=precipitation_hours&current_weather=true`



// console.log(url);

const response = await fetch(url);
const data = await response.json();
// console.log(data);

const precip = data.daily.precipitation_hours;
var days = 0;
if(argv.d >= 0 && argv.d <= 6){ days = argv.d; }
else{ days = 1; }

var statement = "";

if (days == 0) {
    statement = "today.";
  } else if (days > 1) {
    statement = "in " + days + " days.";
  } else {
    statement = "tomorrow.";
  }

if(precip[days] > 0){ console.log("You might need your galoshes " + statement); }
else{ console.log("You probably won't need your galoshes " + statement); }  