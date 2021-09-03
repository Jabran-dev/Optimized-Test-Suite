const fs = require("fs");
const flatten = require('flat')

function getFunctionNames()
{
    let functionNames = [];
    let readFile = fs.readFile("./files/test_functions.json", "utf8", (err, json_string) => {
        if(err)
        {
            console.log("File read failed:", err);
            return;
        }
    
        let testFunctionsJSON = JSON.parse(json_string);
        testFunctionsJSON.forEach((test_function) => {
            let test_function = testFunctionsJSON[3];
            let expression = test_function['expression'];
            let arguments = expression['arguments'];
            functionNames.push(arguments[0]['value']);
        });
    });
    return functionNames;
};

module.exports = {
    getFunctionNames
};