let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');
let func = require('./functions.js');
//
const { exec } = require('child_process');
let readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);
let steamUser = require('steam-user');
let client = new steamUser();

module.exports = {
    login
}

function login(){
    if(!config.autoLogin) {
        rl.question('Enter username: ', (uname) => {
            if (uname == undefined) exit(0);
            if (uname == "1") client.logOn({"accountName": config.username, "password": config.password});
            rl.question('Enter password: ', (pword) => {
                if (pword == undefined) exit(0);
                client.logOn({"accountName": uname, "password": pword});
            })
        })
    } else {
        client.logOn({"accountName": config.username, "password": config.password});
    }
}

client.on('loggedOn', (details, parental) => {
    console.log(`[~] Logged into ${config.username} as ${config.nickname}`);
    client.setPersona(steamUser.EPersonaState.Online, config.nickname);
    client.gamesPlayed("Swoopai.dk");
    exec(`start ${config.url}:${config.usePort}/smokes`);
})

client.on('error', (err) => {
    console.log(`[!] ${err}`);
    login();
})

client.on('disconnected', (eRes, msg) => {
    console.log(`[~] ${msg}`);
    
})

client.on('friendOrChatMessage', (sID, msg, room) => {
    console.log(`[~] Message from ${sID} - ${msg}`);
    switch(msg.toLowerCase()) {
        case "help":
            client.chat.sendFriendMessage(sID, func.getHelp());
            break;
        case "smokes":
            client.chat.sendFriendMessage(sID, func.getSmokes());
            break;
        case "settings":
            client.chat.sendFriendMessage(sID, func.getSettings());
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
            client.chat.sendFriendMessage(sID, func.setSmoke(msg.toLowerCase()) ? "The requested smoke has been set!" : "The requested smoke coulnd't be found!");
            break;
    }
})