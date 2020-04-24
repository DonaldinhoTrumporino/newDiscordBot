const fs = require("fs")

const rulesPath = "./rules.json"
const varsPath = "./variables.json"

const defaultVoice = "701795436767215688"
const defaultText = "701795436767215689"

exports.botMessage = function(client, message) {
    //console.log(message)

    var textChannel = client.channels.fetch(defaultText)

    //checkMessageConditions(message).then((sendRules) => {react(client, sendRules, textChannel, message);})

    var sendRules = checkMessageConditions(message)
    react(client, sendRules, textChannel, message)
}

exports.botVoice = function(client, oldState, newState) {
    //console.log(message)

    var textChannel = client.channels.fetch(defaultText)

    var sendRules = checkVoiceConditions(oldState, newState)
    react(client, sendRules, textChannel)
}


function checkMessageConditions(message){
    var passedTests = true
    var sendRules = []

    fs.readFile(rulesPath, (err1, rulesData) => {
        fs.readFile(varsPath, (err2, varData) => {
            var serverVars = JSON.parse(varData)
            var rules = JSON.parse(rulesData)
            for (var i = 0; i < Object.keys(rules).length; i++){
                var ruleName = Object.keys(rules)[i]
                var layer1 = rules[ruleName]["conditions"]
                var countCheck = 0
                for (var j = 0; j < Object.keys(layer1).length; j++){
                    var indexName = Object.keys(layer1)[j]
                    if (indexName === "message user"){
                        if (layer1["message user"] && !(serverVars[layer1["message user"]].includes(message.author.id))){
                            passedTests = false
                            break
                        }
                        countCheck++
                        continue
                    }
                    if (indexName === "message contents"){
                        if (layer1["message contents"] && !(message.content.toLowerCase().includes(layer1["message contents"].toLowerCase()))){
                            passedTests = false
                            break
                        }
                        countCheck++
                        continue
                    }
                    if (indexName === "message user role"){
                        if (layer1["message user role"] && !(message.member.roles.cache.has(serverVars[layer1["message user role"]]))){
                            passedTests = false
                            break
                        }
                        countCheck++
                        continue
                    }
                    if (indexName === "message channel"){
                        if (layer1["message channel"] && !(serverVars[layer1["message channel"]] === message.channel.id)){
                            passedTests = false
                            break
                        }
                        countCheck++
                        continue
                    }
                    if (indexName === "message file"){
                        if ((layer1["message file"] === "true")  && (message.attachments.first() == null)){
                            passedTests = false
                            break
                        }
                        countCheck++
                        continue
                    }
                }
                if (passedTests && countCheck) sendRules.push(ruleName)
                passedTests = true
            }
        })
    })
    return sendRules
}

function checkVoiceConditions(oldState, newState){
    var passedTests = false
    var sendRules = []

    fs.readFile(rulesPath, (err1, rulesData) => {
        fs.readFile(varsPath, (err2, varData) => {
            var serverVars = JSON.parse(varData)
            var rules = JSON.parse(rulesData)
            for (var i = 0; i < Object.keys(rules).length; i++){
                var ruleName = Object.keys(rules)[i]
                var layer1 = rules[ruleName]["conditions"]
                for (var j = 0; j < Object.keys(layer1).length; j++){
                    var indexName = Object.keys(layer1)[j]
                    if (indexName === "voice user login"){
                        if (!(layer1["voice user login"]) || (serverVars[layer1["voice user login"]] === oldState.member.id)){
                            if (oldState.channelID == undefined && !(newState.channelID == undefined)){
                                passedTests = true
                            }
                        }
                        continue
                    }
                    if (indexName === "voice user logout"){
                        if (!(layer1["voice user logout"]) || (serverVars[layer1["voice user logout"]] === oldState.member.id)){
                            if (newState.channelID == undefined){
                                passedTests = true
                            }
                        }
                        continue
                    }
                }
                if (passedTests) sendRules.push(ruleName)
                passedTests = false
            }
        })
    })
    return sendRules
}

function react(client, sendRules, textChannel, message) {
    var sendContent = {}
    if (message != undefined){
        textChannel = message.channel
    }

    fs.readFile(rulesPath, (err1, rulesData) => {
        fs.readFile(varsPath, (err2, varData) => {
            var serverVars = JSON.parse(varData)
            var rules = JSON.parse(rulesData)
            for (var i = 0; i < sendRules.length; i++){
                var sendMethod = "send"
                var deleteMethod = "none"
                var voiceMethod = ""
                var name = sendRules[i]
                var layer1 = rules[name]["response"]
                for (var j = 0; j < Object.keys(layer1).length; j++){
                    var indexName = Object.keys(layer1)[j]
                    if (indexName === "message contents"){
                        if (layer1["message contents"]){
                            sendContent["content"] = layer1["message contents"]
                        }
                    }
                    if (indexName === "message attachment"){
                        if (layer1["message attachment"]){
                            var arr = [layer1["message attachment"]]
                            sendContent["files"] = arr
                        }
                    }
                    if (indexName === "message channel"){
                        if (layer1["message channel"]){
                            textChannel = client.channels.fetch(serverVars[layer1["message channel"]])
                        }
                    }
                    if (indexName === "message react emoji"){
                        if (layer1["message react emoji"]){
                            message.react(client.emojis.cache.find(emoji => emoji.name === layer1["message react emoji"]))
                        }
                    }
                    if (indexName === "message reply"){
                        if (layer1["message reply"] === "true"){
                            sendMethod = "reply"
                        }
                    }
                    if ((indexName === "message delete") && (layer1["message contents"] === "true")){
                        deleteMethod = "delete"
                    }
                    if (!(layer1["message contents"]) && !(layer1["message attachment"])){
                        sendMethod = "none"
                    }
                    if (indexName === "voice play audio"){
                        if (layer1["voice play audio"]){
                            voiceMethod = "voiceDefault"
                        }
                    }
                    if (indexName === "voice channel" && layer1["voice play audio"]){
                        if (layer1["voice channel"]){
                            voiceMethod = "voice"
                        }
                        else{
                            voiceMethod = "voiceDefault"
                        }
                    }
                }
                if (sendMethod === "reply"){
                    message.reply(sendContent)
                }
                else if (sendMethod === "send"){
                    textChannel.send(sendContent)
                }
                if (deleteMethod === "delete"){
                    message.delete()
                }
                if (voiceMethod){
                    if (voiceMethod === "voiceDefault"){
                        var voiceChannel = client.channels.fetch(defaultVoice)
                        .then(channel => {
                            channel.join()
                                .then(connection => {
                                    const dispatcher = connection.play(layer1["voice play audio"])
                                    dispatcher.on('finish', () => {channel.leave()})
                                })
                        })
                        
                    }
                    else{
                        var voiceChannel = client.channels.fetch(serverVars[layer1["voice channel"]])
                        .then(channel => {
                            channel.join()
                                .then(connection => {
                                    const dispatcher = connection.play(layer1["voice play audio"])
                                    dispatcher.on('finish', () => {channel.leave()})
                                })
                        })
                    }
                }
            }
        })
    })
}
