const fs = require("fs");
const flatten = require('flat')

fs.readFile("./files/test_functions.json", "utf8", (err, json_string) => {
    if(err)
    {
        console.log("File read failed:", err);
        return;
    }

    let testFunctionsJSON = JSON.parse(json_string);
    //testFunctionsJSON.forEach((test_function) => {
        let test_function = testFunctionsJSON[11];
        let expression = test_function['expression'];
        
        let arguments = expression['arguments'];
        console.log('Function Name:'+arguments[0]['value']);
        console.log();
        let blockStatements = arguments[1]['body']['body'];
        console.log(flatten(blockStatements));
        blockStatements.forEach((blockStatement) =>{
            try
            {
                if(blockStatement['type'] == 'ExpressionStatement')
                {
                    let flattenBlockStatement = flatten(blockStatement);
                    let keys = Object.keys(flattenBlockStatement);
                    let inputEnabled = false;
                    let vectorData = [];
                    for(let i = 0; i < keys.length; i++)
                    {
                        if(keys[i].includes('callee.object.name') && flattenBlockStatement[keys[i]] == 'assert')
                        {
                            inputEnabled = true;
                        }
                        
                        if(inputEnabled && (keys[i].match(/arguments.?..value/gi) != null || keys[i].match(/arguments.?..object.name/gi) != null || keys[i].match(/arguments.?..property.name/gi) != null))
                        {
                            vectorData.push(flattenBlockStatement[keys[i]]);
                        }
                    }
                    if(vectorData.length > 0)
                    {
                        console.log(vectorData);
                    }
                }
            }
            catch(ex)
            {
                console.log(ex);
            }
        });
    //});
    
});