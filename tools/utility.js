

const fs = require('fs');
function convertTestCasesIntoJSON(directoryPath)
{
    //passsing directoryPath and callback function
    var files = fs.readdirSync(directoryPath);
    var caseTypes = [];
        
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(file.includes('.js'))
        {
              console.log("\n\nFILE NAME: "+file+"\n\n");
              var fileString = fs.readFileSync(directoryPath+'/'+file, "utf8");
        
              var availableCaseTypes = ["test","it"]; // test OR it ?
              var caseType = "";
              var availableStatementType = ["assert","expect"]; //assert OR expect ?
              var statementType = "";
              var availableSplitterForStatementTypes = [",",".to."];
              var splitterForStatementTypes = "";
              var setLastCharacter = ""; // set value for the last character you want to find for Assert statement
              let arrayOfString = '';
              for(var i=0; i<availableCaseTypes.length;i++)
              {
                  if(fileString.split(availableCaseTypes[i]+"(\'").length > 1)
                  {
                    caseType = availableCaseTypes[i];
                    break;
                  }
              }
              
              if(caseType == "")
              {return;}
              arrayOfString = fileString.split(caseType+"(\'");
        
              function findClosingBracketMatchIndex(str, pos) {
                  if (str[pos] != '(') {
                    throw new Error("No '(' at index " + pos);
                  }
                  let depth = 1;
                  for (let i = pos + 1; i < str.length; i++) {
                    switch (str[i]) {
                    case '(':
                      depth++;
                      break;
                    case ')':
                      if (--depth == 0) {
                        return i;
                      }
                      break;
                    }
                  }
                  return -1;    // No matching closing parenthesis
                }
        
              function getCasesNames(array)
              {
                  let firstIndex = array.indexOf('');
                  let lastIndex = array.indexOf(', function');
                  let content = array.substr(firstIndex,lastIndex);
                  return content;
              }
        
              function getStatementValues(array)
              {
                  let firstIndex = array.indexOf('(');
                  var lastIndex = setLastCharacter;
                  if(!lastIndex)
                  {
                      lastIndex = findClosingBracketMatchIndex(array, firstIndex);
                  }
                  let content = array.substring(firstIndex+1,lastIndex);
                  return content;
              }
        
              function actualPart(value, index)
              {
                  return value.substring(0, index);
              }
        
              function expectedPart(value, index)
              {
                  return value.substring(index+1);
              }
        
              for(var i = 1 ; i < arrayOfString.length ; i++)
              {
                  let content = arrayOfString[i];
                  let CaseName = getCasesNames(content);
                  CaseName.slice(-1) == '\'' || CaseName.charAt(0) == '\''? CaseName = CaseName.replace(/[']+/g, '') : CaseName; // removing Last Index if it is (')
                  console.log("\n\nTest Case Name: " + CaseName);
                  let arrayOfStatementTypes;
                  let statementTypes = [];
                  let readStringFromLast;
                  let ExpectedStatementValues;
                  if(arrayOfString[i].split(availableStatementType[0]).length>1)
                  {
                    statementType = availableStatementType[0];
                    splitterForStatementTypes = availableSplitterForStatementTypes[0];
                    arrayOfStatementTypes = arrayOfString[i].split(statementType);

                    for(var j=1; j < arrayOfStatementTypes.length; j++)
                    {
                        let content = arrayOfStatementTypes[j];
                        let caseDistributorType = content.substring(content.indexOf('.'),content.indexOf('('));
                        let getStatement='';
                        getStatement = getStatementValues(content); //get Statements, each in array
                        readStringFromLast = getStatement.lastIndexOf(splitterForStatementTypes);
              
                        let ActualStatementValues = actualPart(getStatement, readStringFromLast);
                        ExpectedStatementValues = expectedPart(getStatement, readStringFromLast).trim();
                        
                        let isAssertWithOkHasExpectedValue = ExpectedStatementValues.charAt(0) == '\'' && ExpectedStatementValues.slice(-1) == '\''; // to check if AssertStatement with .ok has both actual & expected
                        ExpectedStatementValues.slice(-1) == '\'' || ExpectedStatementValues.charAt(0) == '\''?
                        ExpectedStatementValues = ExpectedStatementValues.replace(/[']+/g, ''):ExpectedStatementValues;
          
                        if(caseDistributorType == '.ok' && statementType == availableStatementType[0] && !isAssertWithOkHasExpectedValue)
                        {
                          ActualStatementValues = getStatement;
                          ExpectedStatementValues = getStatement;
                        }
          
                        // console.log("Actual Values: " + ActualStatementValues);
                        // console.log("Expected Values: "+ExpectedStatementValues);
                        
                        let statementFunction = {
                            'input' : ActualStatementValues,
                            'output' : ExpectedStatementValues 
                        };
                        statementTypes.push(statementFunction);
                    }
                    let caseType = {
                      'function' : CaseName,
                      'assert' : statementTypes
                  };
                  caseTypes.push(caseType);
                }

                else if(arrayOfString[i].split(availableStatementType[1]).length>1)
                {
                  statementType = availableStatementType[1];
                  splitterForStatementTypes = availableSplitterForStatementTypes[1];
                  arrayOfStatementTypes = arrayOfString[i].split(statementType);
                  for(var j=1; j < arrayOfStatementTypes.length; j++)
                  {
                      let content = arrayOfStatementTypes[j];
                      let getStatement='';
                      if(content.indexOf('(') == 0)
                      {
                        getStatement = getStatementValues(content) // for 'Expect' it becomes Actual part
                      }

                      else if(content.indexOf('(') != 0)
                      {
                        continue;
                      } 
                      readStringFromLast = content.indexOf(splitterForStatementTypes); //two Statements because of syntax of Assert & expect
            
                      let ActualStatementValues = actualPart(getStatement, readStringFromLast);
                      ExpectedStatementValues = expectedPart(content, readStringFromLast+3);
                      ExpectedStatementValues = ExpectedStatementValues.substr(0, ExpectedStatementValues.indexOf(';'));
                      
                      ExpectedStatementValues.slice(-1) == '\'' || ExpectedStatementValues.charAt(0) == '\''?
                      ExpectedStatementValues = ExpectedStatementValues.replace(/[']+/g, ''):ExpectedStatementValues;
                      ActualStatementValues = getStatement;
        
                      // console.log("Actual Values: " + ActualStatementValues);
                      // console.log("Expected Values: "+ExpectedStatementValues);
                      
                      let statementFunction = {
                          'input' : ActualStatementValues,
                          'output' : ExpectedStatementValues 
                      };
                      statementTypes.push(statementFunction);
                  }
                  let caseType = {
                    'function' : CaseName,
                    'assert' : statementTypes
                };
                caseTypes.push(caseType);
              }
            }
          }
    });
    var testCasesVectors = getVectorMap(caseTypes);
    return testCasesVectors;
}

function getVectorMap(functions)
{
    let functions_vectors_map = {
        'functions' : []
    };
    functions.forEach((test_function) => {
        let functions_vectors = functions_vectors_map['functions'];
        let input_vector = [];
        let output_vector = [];
        test_function['assert'].forEach((assert_statements) =>{
            input_vector.push(convertStringToNumber(assert_statements['input']));
            output_vector.push(convertStringToNumber(assert_statements['output']));
        });

        let function_vector = {
            'function' : test_function['function'],
            'inputVector' : input_vector.reduce((a, b) => a + b, 0),
            'outputVector' : output_vector.reduce((a, b) => a + b, 0)
        };
        functions_vectors.push(function_vector);
        functions_vectors_map['functions'] = functions_vectors;
    });
    return functions_vectors_map;
}

function convertStringToNumber(value){
    let text_numeric_value = 0;
    for(let i = 0 ; i < value.length; i++)
    {
        let ascii_code = value.charCodeAt(0);
        text_numeric_value += ascii_code;
    }
    return text_numeric_value;
}

module.exports = {
    convertTestCasesIntoJSON, getVectorMap
};