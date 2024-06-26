import "module-alias/register.js";
import * as fs from "fs";
import moment from "moment";
import { bgGreen, cyan, bgBlue, bgYellow, bgRed, bgMagenta, gray, black, bold } from "colorette";

/* Install all necessary files for the bot */
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

console.log(cyan("Installation started..."));

/* Create config-sample.toml */
const configText = fs.readFileSync("./assets/config.txt", "utf8").toString().replace("{version}", packageJson.version);
fs.writeFile("config-sample.toml", configText, function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create config-sample.toml"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created config-sample.toml"));
    }
});

/* assets/disabled.json */
fs.writeFile("./assets/disabled.json", JSON.stringify([]), function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create assets/disabled.json"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created assets/disabled.json"));
    }
});

/* assets/votes.json */
const voteObject = Object.fromEntries(moment.months().map(month => [month.toLowerCase(), 0]));
fs.writeFile("./assets/votes.json", JSON.stringify(voteObject, null, 4), function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create assets/votes.json"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created assets/votes.json"));
    }
});

/* assets/messages.json */
const messagesObject = {
    stats: {}
}
fs.writeFile("./assets/messages.json", JSON.stringify(messagesObject, null, 4), function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create assets/messages.json"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created assets/messages.json"));
    }
});

/* assets/voice.json */
const voiceObject = {
    joinTime: {},
    voiceTime: {},
    afk: {}
};

fs.writeFile("./assets/voice.json", JSON.stringify(voiceObject, null, 4), function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create assets/voice.json"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created assets/voice.json"));
    }
});

/* assets/selke_samstag.json */
const selkeSamstagObject = {
    userClickCount: {}
}

fs.writeFile("./assets/selke_samstag.json", JSON.stringify(selkeSamstagObject, null, 4), function(Error){
    if(Error){
        console.log(bgRed("ERROR") + " " + cyan("Couldn't create assets/selke_samstag.json"));
        console.error(Error);
    }else{
        console.log(bgGreen("SUCCESS") + " " + cyan("Created assets/selke_samstag.json"));
    }
});