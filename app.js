let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');
let func = require('./functions.js');
let bot = require('./bot.js');
//
let setTitle = require('console-title');
let express = require('express');
let app = new express();
//

app.use(express.static('public'));

app.listen(config.usePort, (err) => {
    console.log(err ? err : `[~] Listening on port ${config.usePort}`);
    bot.login();
    setTitle("SWP CS2 - swoopai.dk");
})

app.get('/smokes', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>SWP CS2</title><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><link rel="stylesheet" href="inc/styling/css/index.css?version=2"></head><body><div class="w3-top"><div class="w3-bar" id="navbar"><a class="w3-bar-item w3-button w3-hover-black w3-hide-medium w3-hide-large w3-right" href="javascript:void(0);" onclick="navIconChange()" title="Toggle Navigation Menu"><i class="fa fa-bars"></i></a><a href="#" class="w3-bar-item w3-button w3-hover-dark-gray">HOME</a><a href="https://swoopai.dk" target="_blank" class="w3-bar-item w3-button w3-hide-small w3-hover-dark-gray"><i class="fa fa-user"></i> SWOOPAI</a></div><div class="w3-container w3-padding-64"><h3 class="w3-center">Swoopais CS2 Smoke Bot</h3><p class="w3-center"><em>Welcome to Swoopais CS2 Smoke Bot<br> Below you'll get the instructions for the requested smoke</em></p><br><div class="w3-cell-row"><div class="w3-container w3-cell w3-mobile spotCard"><div class="w3-card-4" style="width:100%"><img src="${spots.current[2]}" alt="Alps" style="width:100%;height:400px"><div class="w3-container w3-center w3-padding"><p><b>${spots.current[0]}</b><br>${spots.current[4]}</p></div></div></div><div class="w3-container w3-cell w3-mobile spotCard"><div class="w3-card-4" style="width:100%"><img src="${spots.current[3]}" alt="Alps" style="width:100%;height:400px"><div class="w3-container w3-center w3-padding"><p><b>${spots.current[0]}</b><br>${spots.current[5]}</p></div></div></div></div></div><div id="smallNav" class="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium"><a href="#" class="w3-bar-item w3-button" onclick="navIconChange()">HOME</a><a href="https://swoopai.dk" target="_blank" class="w3-bar-item w3-button" onclick="navIconChange()">SWOOPAI</a></div></div><script src="inc/styling/js/index.js"></script></body></html>`);
})