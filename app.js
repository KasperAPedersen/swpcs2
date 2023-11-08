let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');
let func = require('./functions.js');
let bot = require('./bot.js');
//
let express = require('express');
let app = new express();
//

app.use(express.static('public'));

app.listen(config.usePort, (err) => {
    console.log(err ? err : `[~] Listening on port ${config.usePort}`);
    err ? exit() : bot.login();
})

app.get('/smokes', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><link rel="stylesheet" href="inc/styling/css/index.css"></head><body><div id="swp"><h2>${spots.current[0]}</h2><p>${spots.current[1]}</p><div id="spotPictures"><img src="${spots.current[2]}" alt="Positioning picture 1"><img src="${spots.current[3]}" alt="Aiming picture"></div></div><script src="inc/styling/js/index.js"></script></body></html>`);
})