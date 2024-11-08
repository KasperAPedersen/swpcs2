let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');

module.exports = {
    getSettings,
    getSmokes,
    getHelp,
    setSmoke,
    setTimer
}

function setTimer(time){
    config.refreshTimer = Number(time);
    return true;
}

function getSettings() {
    let tmp = "The current settings is:\n";
    tmp += `Map: ${settings.map}\n`;
    tmp += `Team: ${settings.team}\n`;
    tmp += `Refresh Timer: ${config.refreshTimer}`;
    tmp += "\n - Swoopai | swoopai.dk";
    return tmp;
}

function getSmokes() {
    let tmp = "The current smokes available is:\n";

    tmp+= "\nMirage:\n"
    for(let spot of spots.mirage) tmp += `[${spot[1]}] - (${spot[0]}) ${spot[2]}\n`;

    tmp+= "\nOverpass:\n"
    for(let spot of spots.overpass) tmp += `[${spot[1]}] - (${spot[0]}) ${spot[2]}\n`;

    tmp+= "\nAnubis:\n"
    for(let spot of spots.anubis) tmp += `[${spot[1]}] - (${spot[0]}) ${spot[2]}\n`;

    tmp += "\n - Swoopai | swoopai.dk";
    return tmp;
}

function getHelp() {
    let tmp = "Welcome to Swoopais CS2 Smoke bot!\n";

    tmp +="\nCommands:\n";
    tmp += "[.tt] - Changes team to terrorist\n[.ct] - Changes team to counter-terrorist\n";
    tmp += "[.mirage] - Changes map to mirage\n";
    tmp += "[.overpass] - Changes map to overpass\n";
    tmp += "[.anubis] - Changes map to anubis\n";
    tmp += "[.timer <time>] - Sets how often the website should refresh (in MS)\n";

    tmp += "\n- Swoopai | swoopai.dk";
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
        case "anubis":
            cSpots = spots.anubis;
            break;
        default:
            return false;
    }
    
    for(let spot of cSpots) {
        if (req == spot[1] && settings.team == spot[0]) {
            isFound = true;
            spots.current = [spot[3], spot[4], spot[5], spot[6], spot[7], spot[8]];
            break;
        }
    }
    return isFound;
}