let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');
//
let express = require('express');
let steamUser = require('steam-user');
let client = new steamUser();
let app = new express();
//

app.use(express.static('public'));

app.listen(config.usePort, (err) => {
    console.log(err ? err : `[~] Listening on port ${config.usePort}`);
    err ? exit() : login();
})

app.get('/smokes', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><link rel="stylesheet" href="inc/styling/css/index.css"></head><body><div id="swp"><h2>${spots.current[0]}</h2><p>${spots.current[1]}</p><div id="spotPictures"><img src="${spots.current[2]}" alt="Positioning picture 1"><img src="${spots.current[3]}" alt="Aiming picture"></div></div><script src="inc/styling/js/index.js"></script></body></html>`);
})

// -- Steam

function login(){
    if(config.username == undefined || config.password == undefined) {
        console.log("[!] Invalid steam account details!");
        return;
    }
    client.logOn({"accountName": config.username, "password": config.password});
}

client.on('loggedOn', (details, parental) => {
    console.log(`[~] Logged into ${config.username} as ${config.nickname}`);
    client.setPersona(steamUser.EPersonaState.Online, config.nickname);
})

client.on('error', (err) => {
    console.log(`[!] ${err}`);
})

client.on('disconnected', (eRes, msg) => {
    console.log(`[~] ${msg}`);
})

client.on('friendOrChatMessage', (sID, msg, room) => {
    console.log(`[~] Message from ${sID} - ${msg}`);
    switch(msg.toLowerCase()) {
        case "help":
            client.chat.sendFriendMessage(sID, getHelp());
            break;
        case "smokes":
            client.chat.sendFriendMessage(sID, getSmokes());
            break;
        case "settings":
            client.chat.sendFriendMessage(sID, getSettings());
            break;
        case ".tt":
            settings.team = "tt";
            client.chat.sendFriendMessage(sID, "Team has been set to 'tt'");
            break;
        case ".ct":
            settings.team = "ct";
            client.chat.sendFriendMessage(sID, "Team has been set to 'ct'");
            break;
        case ".mirage":
            settings.map = "mirage";
            client.chat.sendFriendMessage(sID, "Map has been set to 'mirage'");
            break;
        case ".overpass":
            settings.map = "overpass";
            client.chat.sendFriendMessage(sID, "Map has been set to 'overpass'");
            break;
        default:
            client.chat.sendFriendMessage(sID, setSmoke(msg.toLowerCase()) ? "The requested smoke has been set!" : "The requested smoke coulnd't be found!");
            break;
    }
})

function getSettings() {
    let tmp = "The current settings is:\n";
    tmp += `Map: ${settings.map}\n`;
    tmp += `Team: ${settings.team}`;
    return tmp;
}

function getSmokes() {
    let tmp = "The current smokes available is:\n";

    tmp+= "\nMirage:\n"
    for(let spot of spots.mirage) tmp += `[${spot[1]}] - (${spot[0]}) ${spot[2]}\n`;

    tmp+= "\nOverpass:\n"
    for(let spot of spots.overpass) tmp += `[${spot[1]}] - (${spot[0]}) ${spot[2]}\n`;

    return tmp;
}

function getHelp() {
    let tmp = "Welcome to Swoopais CS2 Smoke bot!\n";

    tmp +="\nCommands:\n";
    tmp += "[.tt] - Changes team to terrorist\n[.ct] - Changes team to counter-terrorist\n";
    tmp += "[.mirage] - Changes map to mirage\n";
    tmp += "[.overpass] - Changes map to overpass\n";

    tmp += "\n- Swoopai";
    return tmp;
}

function setSmoke(req) {
    let isFound = false, cSpots;
    if (req == undefined) return;

    switch(settings.map) {
        case "mirage":
            cSpots = spots.mirage;
            break;
        case "overpass":
            cSpots = spots.overpass;
            break;
        default:
            return false;
    }
    
    for(let spot of cSpots) {
        if (req == spot[1] && settings.team == spot[0]) {
            isFound = true;
            spots.current = [spot[3], spot[4], spot[5], spot[6]];
            break;
        }
    }
    return isFound;
}