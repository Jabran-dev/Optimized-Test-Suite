const fs = require('fs');
const { kill } = require('process');
let args = process.argv.slice(2);
let pathToFile = args[0]
let string = args[1]

var CSVProcessor = (function(path){
	let totalmutants = null;
	let header = null;
	let data = fs.readFileSync(path,'utf8');
    let templines = data.split('\n')
    header = templines.slice(0,1)[0].split('|').splice(2);
    let testCases = header.map(line=>line.split('-')[0]);
    let linesExceptFirst = templines.slice(1,templines.length-1); //uptil the last item(exclusive) since it is empty string
	totalmutants = linesExceptFirst.length;
    let lines = linesExceptFirst.map(line=>line.split('|').splice(2));

	return{
		getTestCases : function(){
			return testCases;
		},
		getMutationScore : function(testCaseIndices){
			let killedMutants = 0;
			for (let line of lines){
				for (let idx of testCaseIndices){
					if (line[idx] === '0'){
						killedMutants += 1
						break;
					}
				}
			}
			//survivedMutants = totalmutants - discardedmutants - killedMutants;
			let mutationScore = ((killedMutants/totalmutants)*100).toFixed(2);
			let survivedMutants = totalmutants - killedMutants;
			let result = [totalmutants,killedMutants,survivedMutants,mutationScore];
			return result;
		}
        /*
		getMutationScore: function(){
			let killedMutants = 0;
            console.log('Printing Lines From All Test Cases Mutation Score');
			for (let line of lines){
				for (let idx of line){
					if (idx === '0'){
						killedMutants += 1
						break;
					}
				}
			}
			let survivedMutants = totalmutants - discardedmutants - killedMutants;
			let mutationScore = ((killedMutants/(totalmutants - discardedmutants))*100).toFixed(2);
			let result = [totalmutants,discardedmutants,killedMutants,survivedMutants,mutationScore];
			return result;
		}*/
	};
})(pathToFile);

if (string == null){
	console.log("Computing mutationScore for all test cases");
	result = CSVProcessor.getMutationScore();
	console.log("Total Mutants = "+result[0]);
	console.log("Killed Mutants = "+result[1]);
	console.log("Survived Mutants = "+result[2]);
	console.log("Mutation Score: "+ result[3])
}
else{
	console.log("Computing mutationScore for "+ string);
	string = string.split(",")
	arr = []
	for (var s of string){
		arr.push(parseInt(s))
	}
	result = CSVProcessor.getMutationScore(arr);
	console.log("Total Mutants = "+result[0]);
	console.log("Killed Mutants = "+result[1]);
	console.log("Survived Mutants = "+result[2]);
	console.log("Mutation Score: "+ result[3])
}