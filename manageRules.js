const fs = require("fs")

const rulesPath = "./rules.json"
const varsPath = "./variables.json"

exports.manageRules = function(client, message) {
    //console.log(message.content);

    if(message.content.length == 2 && message.content.charAt(1) === '?'){
        message.channel.send("|\nBot Management\n\n$list    ->  list rules\n$add     ->  add rule\n$delete   ->  delete rule")
    }
    else if(message.content.includes("$list")){
        if(message.content.length == 5){
            fs.readFile(rulesPath, (err, rulesData) => {
                let returnRuleList = ""
                let rules = JSON.parse(rulesData)
                for (let x in rules){
                    returnRuleList += "\n" + x
                }
                message.channel.send("|\nRule List:\n" + returnRuleList)
            })
        }
        else if (message.content.charAt(5) === " ")
        {
            let ruleList = message.content.slice(5).trim().split(/,+/g)
            fs.readFile(rulesPath, (err, rulesData) => {
                let returnRuleList = ""
                let rules = JSON.parse(rulesData)
                for (let x of ruleList){
                    if (x.trim() in rules){
                        returnRuleList += "Parameters for " + x.trim()
                        returnRuleList += JSON.stringify(rules[x.trim()]).replace(/{/gi, "\n").replace(/}/gi, "\n").replace(/,/gi, "\n") + "\n"
                    }
                }
                if (returnRuleList){
                    message.channel.send("|\nRule List:\n\n" + returnRuleList)
                }
                else{
                    message.channel.send("No Rules Found!")
                }
            })
        }
    }
    else if(message.content.length == 4 && message.content.includes("$add")){
        /*if (fs.readFileSync(addRulePath)){
            message.channel.send("What the fuck are you trying to do?")
        }*/
        let addRuleJSON = {}
        addRuleJSON["name"] = message.author.id
        addRuleJSON["channel"] = message.channel.id
        addRuleJSON["timestamp"] = Date.now()

        fs.writeFileSync(message.author.id + "user.json", JSON.stringify(addRuleJSON))

        message.channel.send("What is the name of the new rule? (type \"quit\" to stop)")
    }
    else if(message.content.includes("$delete")){
        if (message.content.charAt(7) === " "){
            let returnRuleList = ""
            let ruleList = message.content.slice(7).trim().split(/,+/g)
            let rulesData = fs.readFileSync(rulesPath)
            let rules = JSON.parse(rulesData)

            for (let x of ruleList){
                if (x.trim() in rules){
                    delete rules[x.trim()]
                    returnRuleList += x.trim() + "\n"
                }
            }
            if (returnRuleList){
                message.channel.send("|\nRules Deleted:\n\n" + returnRuleList)
            }
            else{
                message.channel.send("No Rules Found!")
            }
            fs.writeFileSync(rulesPath, JSON.stringify(rules))
        }
    }
}