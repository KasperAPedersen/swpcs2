let settings = require('./settings.js');
let config = require('./config.js');
let spots = require('./spots.js');
let func = require('./functions.js');
//
let steamServerQuery = require('steam-server-query');
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
            if (uname == undefined) return;
            rl.question('Enter password: ', (pword) => {
                if (pword == undefined) return;
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
    let tmpMsg = msg.split(' ');
    switch(tmpMsg[0].toLowerCase()) {
        case "dayz":
            let tmpMsg = msg.split(' ');
            if (tmpMsg[1] == "server") {
                if(tmpMsg[2] != undefined) settings.server = tmpMsg[2];
            } else if (tmpMsg[1] == "port") {
                if(tmpMsg[2] != undefined) settings.port = tmpMsg[2];
            } else if (tmpMsg[1] == "show") {
                client.chat.sendFriendMessage(sID, `Server IP: ${settings.server}\nServer Port: ${settings.port}`);
            } else {
                steamServerQuery.queryGameServerInfo(`${settings.server}:${settings.port}`).then(infoResponse => {
                    client.chat.sendFriendMessage(sID, `${infoResponse.name}\n${infoResponse.map}\n${infoResponse.players}/${infoResponse.maxPlayers}`);
                }).catch((err) => {
                    client.chat.sendFriendMessage(sID, "Weren't able to query the server.");
                });
            }
            break;
        case "web":
            exec(`start ${config.url}:${config.usePort}/smokes`);
            break;
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
            let tmp = msg.split(' ');
            if (tmp[0] == ".timer") {
                client.chat.sendFriendMessage(sID, func.setTimer(tmp[1]) ? `Refresh timer has been set to ${tmp[1]}!` : "Something went wrong while setting the refresh timer!");
            }  else {
                client.chat.sendFriendMessage(sID, func.setSmoke(msg.toLowerCase()) ? "The requested smoke has been set!" : "The requested smoke coulnd't be found!");
            }
            break;
    }
})