const path = require('path');
const fs = require("fs");
const KMeans = require("tf-kmeans");
const turf = require("@turf/turf");
const utility = require("./tools/utility");
const tf = require("@tensorflow/tfjs");
const { Script } = require("vm");
const kmeans = new KMeans.default({
    k: 7,
    maxIter: 30,
    distanceFunction: KMeans.default.EuclideanDistance
});


let packageName = "uuid-3.21";
let testFileName = "files/uuid-new.csv";
let directoryPath = path.join(__dirname, 'examples/'+packageName+'/test');


let functionsVectorsMap = utility.convertTestCasesIntoJSON(directoryPath);

let testCaseIdToNumericVectors = new Map();
let originaltestCasesIds = '';
functionsVectorsMap['functions'].forEach((functionVector) => {

    originaltestCasesIds = originaltestCasesIds == '' ? functionVector['function'].split('-')[1] : originaltestCasesIds + ',' +functionVector['function'].split('-')[1];
    testCaseIdToNumericVectors.set(
        functionVector['function'],
        [functionVector['inputVector'], functionVector['outputVector']]
    );
});


let coverageCriteria = 'Mutation Score';
let originalTestSuiteCoverage = getTestSuiteCoverage(testFileName, originaltestCasesIds, coverageCriteria);
console.log('Original Test Suite Coverage: '+originalTestSuiteCoverage);


let step = testCaseIdToNumericVectors.size/2;
let k_size = parseInt(step);
kmeans.k = k_size;
let reducedTestCaseIdToNumericVectors = testCaseIdToNumericVectors;
console.log('Step is: '+step);
console.log('K is: '+k_size);
console.log('Original Test Case Ids To Numeric Vectors are: ');
console.log(reducedTestCaseIdToNumericVectors);
let clusterToReducedTestCaseIds;
let reducedTestSuiteCoverage;
let iteration = 0;
while(step > 0)
{
    console.log('>>>>>>>>>Iteration '+iteration);
    let testCasesNumericVectors = Array.from(reducedTestCaseIdToNumericVectors.values());
    console.log(testCasesNumericVectors);
    const dataset = tf.tensor(testCasesNumericVectors);
    const predictions = kmeans.Train(
        dataset
    );
    let clusters = predictions.arraySync();
    console.log('Printing K means info:');
    console.log(clusters);
    console.log(kmeans.Centroids().arraySync());
    clusterToReducedTestCaseIds = getClusterToReducedTestCaseIds(testCaseIdToNumericVectors, clusters, kmeans.Centroids().arraySync());
    console.log('Printing Clusters To Reduced Test Case Ids');
    console.log(clusterToReducedTestCaseIds);
    let reducedtestCasesIds = Array.from(clusterToReducedTestCaseIds.keys()).toString();
    console.log('Printing Reduced Test Case Ids');
    console.log(reducedtestCasesIds);
    reducedTestSuiteCoverage = getTestSuiteCoverage(testFileName, reducedtestCasesIds, coverageCriteria);
    console.log('Printing Reduced Test Suite Coverage');
    console.log(reducedTestSuiteCoverage);
    if(step <= 1)
    {
        step = 0;
    }
    else
    {
        step = step/2;
    }
    console.log('Step is: '+step);
    if(reducedTestSuiteCoverage < originalTestSuiteCoverage)
    {
        console.log('Reduced Test Suite Coverage is lesser than Original Test Suite Coverage');
        k_size = k_size + step;
    }
    else
    {
        console.log('Reduced Test Suite Coverage is greater than or equal to Original Test Suite Coverage');
        let temp = new Map();
        let reducedTestCasesIdsArray = Array.from(clusterToReducedTestCaseIds.values());
        console.log('Printing Reduced Test Case Ids');
        console.log(reducedTestCasesIdsArray);
        reducedTestCasesIdsArray.forEach((testCaseId) => {
            temp.set(
                testCaseId,
                testCaseIdToNumericVectors.get(testCaseId)
            );
        });
        reducedTestCaseIdToNumericVectors = temp;
        console.log('New Reduced Test Case Id To Numeric Vectors');
        console.log(reducedTestCaseIdToNumericVectors);

        k_size = k_size - step;
    }
    k_size = parseInt(k_size);
    kmeans.k = k_size;
    iteration++;
}
let temp = new Map();
let reducedTestCasesIdsArray = Array.from(clusterToReducedTestCaseIds.values());
reducedTestCasesIdsArray.forEach((testCaseId) => {
    temp.set(
        testCaseId,
        testCaseIdToNumericVectors.get(testCaseId)
    );
});
reducedTestCaseIdToNumericVectors = temp;
console.log('New Reduced Test Case Id To Numeric Vectors');
console.log(reducedTestCaseIdToNumericVectors);
console.log('Coverage of Reduced Test Suite:'+reducedTestSuiteCoverage);

function getClusterToReducedTestCaseIds(testCaseIdToNumericVectors, clusters, centroids)
{
    let testCaseIdToCluster = getTestCaseIdToClusterMap(testCaseIdToNumericVectors, clusters);
    let clusterToTestCaseNumericVectors = getClusterToTestCasesNumericVectors(testCaseIdToNumericVectors, testCaseIdToCluster);
    let clusterToTestCaseId = new Map();
    for(let [cluster, numericVectors] of clusterToTestCaseNumericVectors)
    {
        let centroid = centroids[cluster];
        if(centroid == undefined)
        {
            continue;
        }
        let targetPoint = turf.point(centroid, {"marker-color": "#0F0"});
        let points = turf.featureCollection(numericVectors);
        let nearest = turf.nearestPoint(targetPoint, points);
        let nearestNumericVector = nearest.geometry.coordinates;
        let nearestTestCaseId = getTestCaseIdGivenNumericVector(testCaseIdToNumericVectors, nearestNumericVector);
        clusterToTestCaseId.set(cluster, nearestTestCaseId);
    }
    console.log(clusterToTestCaseId);
    return clusterToTestCaseId;
}

function getTestCaseIdToClusterMap(test_case_id_to_input_vectors, clusters)
{
    let testCaseIdToCluster = new Map();
    let count = 0;
    for (let [key, value] of test_case_id_to_input_vectors)
    {
        testCaseIdToCluster.set(key, clusters[count]);
        count++;
    }
    return testCaseIdToCluster;
}

function getClusterToTestCasesNumericVectors(testCaseIdToNumericVectors, testCaseIdToCluster)
{
    let clusterToTestCasesNumericVectors = new Map();
    for(let [testCaseId, clusterValue] of testCaseIdToCluster)
    {
        let numericVectors = [];
        if(clusterToTestCasesNumericVectors.has(clusterValue))
        {
            numericVectors = clusterToTestCasesNumericVectors.get(clusterValue);
        }
        numericVectors.push(turf.point(testCaseIdToNumericVectors.get(testCaseId)));
        clusterToTestCasesNumericVectors.set(clusterValue, numericVectors);
    }
    return clusterToTestCasesNumericVectors;
}

function getTestCaseIdGivenNumericVector(testCaseIdToNumericVectors, givenNumericVector)
{
    let returnTestCaseId = undefined;
    for(let [testCaseId, numericVector] of testCaseIdToNumericVectors)
    {
        if(numericVector[0] == givenNumericVector[0] && numericVector[1] == givenNumericVector[1])
        {
            returnTestCaseId = testCaseId;
            break;
        }
    }
    return returnTestCaseId;
}

function getTestSuiteCoverage(file_name, test_cases_csv_string, coverage_criteria)
{
    if(coverage_criteria == 'Mutation Score')
    {
        return getMutationScore(file_name, test_cases_csv_string);
    }
    return null;
}

function getMutationScore(file_name, test_cases_csv_string)
{
    const { execFileSync } = require('child_process');
    const output = execFileSync("node", ["tools/quickMutationScore.js", file_name, test_cases_csv_string]);
    lines = output.toString().split("\n");
    let mutation_score = 0;
    for (let line of lines)
    {
        if (line.includes("Mutation Score:"))
        {
            mutation_score = parseFloat(line.split(":")[1]);
        }
    }
    return mutation_score;
}

function getStatementCoverage(test_cases_csv_string)
{
    const { execSync } = require('child_process');
    const output = execSync("npx nyc mocha test2/test.js --grep /-[123456789]-/");
    console.log(output)
    return output;
}