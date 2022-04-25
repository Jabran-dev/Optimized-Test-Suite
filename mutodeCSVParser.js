const fs = require('fs');
const path = require('path');

function getTestCaseToVectorsMap(filePath)
{
    var fileString = fs.readFileSync(filePath, "utf8");
    var fileLines = fileString.split("\n");
    var testCasesNames = fileLines[0].split("|");
    let testCaseToVectors = new Map();
    for(let i = 2 ; i < testCasesNames.length ; i++)
    {
        let killedMutants = 0;
        let nonKilledMutants = 0;
        for(let j = 1 ; j < fileLines.length ; j++)
        {
            var mutantResult = fileLines[j].split("|");
            if(mutantResult[i] != undefined && parseInt(mutantResult[i]) == 1)
            {
                killedMutants = killedMutants + 1;
            }
            else
            {
                nonKilledMutants = nonKilledMutants + 1;
            }
            
        }
        testCaseToVectors.set(
            testCasesNames[i],
            [killedMutants, nonKilledMutants]
        );
        
        
    }
    return testCaseToVectors;
}

module.exports = {
    getTestCaseToVectorsMap
};

    
    