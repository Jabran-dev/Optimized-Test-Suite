const path = require('path');
const fs = require("fs");
const KMeans = require("tf-kmeans");
const KMeansPP = require("skmeans");
const turf = require("@turf/turf");
const utility = require("./tools/utility");
const mutodeCSVParser = require("./mutodeCSVParser");
const tf = require("@tensorflow/tfjs");
const roundTo = require('round-to');
const { Script } = require("vm");
const { test } = require('mocha');

const startTimeOfExecution = new Date();
let packageName = process.argv[2];
let testFileName = process.argv[3];
let coverageCriteria = 'Mutation Score';
let algorithm = process.argv[4];
let delta = process.argv[5];
let ensemble = process.argv[6];

let testCaseIdToNumericVectors = mutodeCSVParser.getTestCaseToVectorsMap(testFileName);

let originaltestCasesIds = '';
let originalSetSize = 0;
testCaseIdToNumericVectors.forEach((value, key) => {

    originalSetSize++;
    if(key.split('-')[0] != undefined)
    {
        originaltestCasesIds = originaltestCasesIds == '' ? key.split('-')[0] : originaltestCasesIds + ',' + key.split('-')[0];
    }
});

let originalTestSuiteCoverage = getTestSuiteCoverage(testFileName, originaltestCasesIds, coverageCriteria);
originalTestSuiteCoverage = originalTestSuiteCoverage - delta;

for(let numOfRuns = 0 ; numOfRuns < ensemble ; numOfRuns++)
{
    let step = roundTo.up(testCaseIdToNumericVectors.size/2, 0);
    let k_size = step;
    let kmeans = new KMeans.default({
        k: 7,
        maxIter: 30,
        distanceFunction: KMeans.default.EuclideanDistance
    });
    kmeans.k = k_size;
    let reducedTestCaseIdToNumericVectors = testCaseIdToNumericVectors;
    console.log('Processing...');
    console.log('K: '+k_size);
    console.log('Step: '+step);
    let clusterToReducedTestCaseIds;
    let reducedTestSuiteCoverage;
    let iteration = 0;
    while(step > 0)
    {
        console.log('Iteration '+iteration);

        let testCasesNumericVectors = Array.from(reducedTestCaseIdToNumericVectors.values());
        //console.log(testCasesNumericVectors);
        let clusters;
        let centroids;
        if(algorithm == 'kmpp')
        {
            let kmeansPPResponse = KMeansPP(testCasesNumericVectors, k_size , "kmpp", 30);
            clusters = kmeansPPResponse.idxs;
            centroids = kmeansPPResponse.centroids;
            console.log('Running Kmeans++');
        }
        else if(algorithm == 'km')
        {
            const dataset = tf.tensor(testCasesNumericVectors);
            const predictions = kmeans.Train(
                dataset
            );
            clusters = predictions.arraySync();
            centroids = kmeans.Centroids().arraySync();
            console.log('Running Kmeans');
        }

        /*console.log('Printing K means info:');
        console.log(clusters);
        console.log(centroids);*/
        
        clusterToReducedTestCaseIds = getClusterToReducedTestCaseIds(testCaseIdToNumericVectors, clusters, centroids);
        /*console.log('Printing Clusters To Reduced Test Case Ids');
        console.log(clusterToReducedTestCaseIds);*/
        
        let reducedtestCasesIds = getReducedTestCaseIds(clusterToReducedTestCaseIds);
        /*console.log('Printing Reduced Test Case Ids');
        console.log(reducedtestCasesIds);*/
        
        reducedTestSuiteCoverage = getTestSuiteCoverage(testFileName, reducedtestCasesIds, coverageCriteria);
        /*console.log('Printing Reduced Test Suite Coverage');
        console.log(reducedTestSuiteCoverage);*/

        if(step == 1)
        {
            step = 0;
        }
        else
        {
            step = roundTo.up(step/2, 0);
        }
        /*console.log('Step is: '+step);
        console.log('K is: '+k_size);*/
        if(reducedTestSuiteCoverage < originalTestSuiteCoverage)
        {
            k_size = k_size + step;
        }
        else
        {
            let temp = new Map();
            let reducedTestCasesIdsArray = Array.from(clusterToReducedTestCaseIds.values());
            reducedTestCasesIdsArray.forEach((testCaseId) => {
                temp.set(
                    testCaseId,
                    testCaseIdToNumericVectors.get(testCaseId)
                );
            });
            reducedTestCaseIdToNumericVectors = temp;
            k_size = k_size - step;
        }

        if(k_size > reducedTestCaseIdToNumericVectors.size)
        {
            step = 0;
        }
        kmeans.k = k_size;
        /*
        if(step == 0 && reducedTestSuiteCoverage < originalTestSuiteCoverage)
        {
            step = roundTo.up(testCaseIdToNumericVectors.size/2, 0);
            k_size = step;
            kmeans.k = k_size;
            reducedTestCaseIdToNumericVectors = testCaseIdToNumericVectors;
        }*/
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
    /*console.log('New Reduced Test Case Id To Numeric Vectors');
    console.log(reducedTestCaseIdToNumericVectors);*/
    console.log('Coverage of Reduced Test Suite:'+reducedTestSuiteCoverage);
    const endTimeOfExecution = new Date();
    
    let totalExecutionTime = endTimeOfExecution.getTime() - startTimeOfExecution.getTime();
    let reducedSetKeys = reducedTestCaseIdToNumericVectors.keys();
    
    utility.generateCSVReport(packageName, totalExecutionTime, originalTestSuiteCoverage, 
    reducedTestSuiteCoverage, reducedSetKeys, originalSetSize, reducedTestCaseIdToNumericVectors.size, delta);
    console.log('Original Mutation Score:'+originalTestSuiteCoverage);
}

function getReducedTestCaseIds(clusterToReducedTestCaseIds)
{
    let testCaseIds='';
    clusterToReducedTestCaseIds.forEach((value, key) => {
        let str = value;
        let splittedStr = str.split('-');
        if(splittedStr[0] != undefined)
        {
            testCaseIds = testCaseIds == '' ? splittedStr[0] : testCaseIds + ',' + splittedStr[0];
        } 
    });
    return testCaseIds;
}
function getClusterToReducedTestCaseIds(testCaseIdToNumericVectors, clusters, centroids)
{
    let clusterToTestCases = getClusterToTestCasesMap(testCaseIdToNumericVectors, clusters);
    let clusterToTestCaseId = new Map();
    for(let [cluster, testCases] of clusterToTestCases)
    {
        let centroid = centroids[cluster];
        if(centroid == undefined)
        {
            continue;
        }
        let numericVectors = [];
        for(let testCase of testCases)
        {
            numericVectors.push(turf.point(testCase.NumericVector));
        }
        let targetPoint = turf.point(centroid, {"marker-color": "#0F0"});
        let points = turf.featureCollection(numericVectors);
        let nearest = turf.nearestPoint(targetPoint, points);
        let nearestNumericVector = nearest.geometry.coordinates;
        let nearestTestCaseId = getTestCaseIdGivenNumericVector(testCaseIdToNumericVectors, nearestNumericVector);
        clusterToTestCaseId.set(cluster, nearestTestCaseId);
    }
    return clusterToTestCaseId;
}

function getClusterToTestCasesMap(testCaseIdToNumericVectors, clusters)
{
    let clusterToTestCases = new Map();
    let count = 0;
    for(let [testCaseId, numericVector] of testCaseIdToNumericVectors)
    {
        let testCases = [];
        if(clusterToTestCases.has(clusters[count]))
        {
            testCases = clusterToTestCases.get(clusters[count]);
        }
        testCases.push({
            'TestCaseId' : testCaseId,
            'NumericVector' : numericVector
        });
        clusterToTestCases.set(clusters[count], testCases);
        count++;
    }
    return clusterToTestCases;
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