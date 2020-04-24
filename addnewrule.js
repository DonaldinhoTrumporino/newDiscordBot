const fs = require("fs")

exports.addNewRule = function(client, message) {
    let addRuleJSON = JSON.parse(fs.readFileSync("./" + message.author.id + "user.json"))
    addRuleJSON["timestamp"] = Date.now()

    if (Object.keys(addRuleJSON).length > 3){
        if(addRuleJSON["event"]){
            if (addRuleJSON["event"] === "message"){
                addMessage(client, message)
            }
            else if (addRuleJSON["event"] === "voice") {
                addVoice(client, message)
            }
        }
        else{
            if (message.content === "voice" || message.content === "v"){
                addRuleJSON["event"] = "voice"
                addRuleJSON[message.content] = {
                                                    "conditions": {
                                                        "voice user login": "[]", 
                                                        "voice user logout": "[]"
                                                    },
                                                    "response": {
                                                        "message contents": "",
                                                        "message attachment": "",
                                                        "message channel": "",
                                                        "message react emoji": "",
                                                        "message reply": "false",
                                                        "message delete": "false",
                                                        "voice play audio": ""
                                                    }
                                                }
                message.channel.send("Which user logging on does this rule trigger on? (type \"quit\" to stop)")
            }
            else if (message.content === "message" || message.content === "m"){
                addRuleJSON["event"] = "message"
                addRuleJSON[message.content] = {
                                                    "conditions": {
                                                        "message user": "[]", 
                                                        "message contents": "[]",
                                                        "message user role": "[]",
                                                        "message channel": "[]",
                                                        "message file": "false"
                                                    },
                                                    "response": {
                                                        "message contents": "",
                                                        "message attachment": "",
                                                        "message channel": "",
                                                        "message react emoji": "",
                                                        "message reply": "false",
                                                        "message delete": "false",
                                                        "voice play audio": ""
                                                    }
                                                }
                message.channel.send("Who does this rule trigger on (\"none\" to trigger on everyone)? (type \"quit\" to stop)")
            }
            else{
                message.channel.send("Does not Compute.  Try again. (type \"quit\" to stop)")
            }
            fs.writeFileSync(message.author.id + "user.json", JSON.stringify(addRuleJSON))
        }
        
    }
    else{           // No rule, ask for user
        addRuleJSON["flags"] = 0
        addRuleJSON["event"] = ""
        fs.writeFileSync(message.author.id + "user.json", JSON.stringify(addRuleJSON))
        message.channel.send("Does this rule trigger on a message event (type \"message\") or voice event(type \"voice\")? (type \"quit\" to stop)")
    }
}

function addMessage(client, message) {
    let addRuleJSON = JSON.parse(fs.readFileSync("./" + message.author.id + "user.json"))
    let completeFlag = addRuleJSON["flags"]
    let currentKey = addRuleJSON[Object.keys(addRuleJSON)[5]]
    if(completeFlag & 1){
        if(completeFlat & 2){
            console.log("DEBUG")
        }
        else{
            let curUserVal = currentKey["conditions"]
            if(message.content === "none" || message.content === "n"){
                completeFlag += 1
                message.channel.send("What channels does this rule trigger on(\"none\" to ignore)? (type \"quit\" to stop)")
            }
            else{
                curUserVal["message contents"].push(client.users.cache.find(user => user.username === message.content).id)
                message.channel.send("What other kewords does this rule trigger on (\"none\" to finish)? (type \"quit\" to stop)")
            }
        }
    }
    else{
        let curUserVal = currentKey["conditions"]
        console.log(curUserVal)
        if(message.content === "none" || message.content === "n"){
            completeFlag += 1
            message.channel.send("What keywords does this rule trigger on(\"none\" to ignore)? (type \"quit\" to stop)")
        }
        else{
            console.log(curUserVal["message user"])
            curUserVal["message user"].push(client.users.cache.find(user => user.username === message.content).id)
            message.channel.send("Who else does this rule trigger on (\"none\" to finish)? (type \"quit\" to stop)")
        }
    }
    fs.writeFileSync(message.author.id + "user.json", JSON.stringify(addRuleJSON))
}

function addVoice(client, message) {
    let addRuleJSON = JSON.parse(fs.readFileSync("./" + message.author.id + "user.json"))
}


/*var completeFlag = addRuleJSON["flags"]
        console.log(completeFlag)
        if (Object.keys(addRuleJSON)[3]){
            var nextKey = addRuleJSON[Object.keys(addRuleJSON)[3]]["conditions"]
            if (completeFlag & 1){           // check if user complete
                console.log("DEBUG")
            }
            else{               // user not complete
                console.log("DEBUG")
            }
        }*/