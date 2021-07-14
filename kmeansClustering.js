const fs = require("fs");
const KMeans = require("tf-kmeans");
const utility = require("./tools/utility");
const tf = require("@tensorflow/tfjs");
const { Script } = require("vm");
const kmeans = new KMeans.default({
    k: 7,
    maxIter: 30,
    distanceFunction: KMeans.default.EuclideanDistance
});


fs.readFile("./files/TestCases.json", "utf8", (err, json_string) => {
    if(err)
    {
        console.log("File read failed:", err);
        return;
    }
    
    let originalMutationScore = getMutationScore("0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16");
    console.log('Original Test Suite Mutation Score: '+originalMutationScore);
    let testCasesJson = JSON.parse(json_string);
    let functionsVectorsMap = utility.getVectorMap(testCasesJson);
    let testCaseIdToNumericVectors = new Map();

    functionsVectorsMap['functions'].forEach((functionVector) => {
        testCaseIdToNumericVectors.set(
            functionVector['function'],
            [functionVector['inputVector'], functionVector['outputVector']]
        );
    });
    let step = testCaseIdToNumericVectors.size/2;
    let k_size = parseInt(step);
    kmeans.k = k_size;
    let reducedTestCaseIdToNumericVectors = testCaseIdToNumericVectors;
    console.log('Step is: '+step);
    console.log('K is: '+k_size);
    console.log('Original Test Case Ids To Numeric Vectors are: ');
    console.log(reducedTestCaseIdToNumericVectors);
    let clusterToReducedTestCaseIds;
    let reducedMutationScore;
    while(step > 0)
    {
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
        reducedMutationScore = getMutationScore(reducedtestCasesIds);
        console.log('Printing Reduced Mutation Score');
        console.log(reducedMutationScore);
        if(step <= 1)
        {
            step = 0;
        }
        else
        {
            step = step/2;
        }
        console.log('Step is: '+step);
        if(reducedMutationScore < originalMutationScore)
        {
            console.log('Reduced Mutation Score is lesser than Original Mutation Score');
            k_size = k_size + step;
        }
        else
        {
            console.log('Reduced Mutation Score is greater than or equal to Original Mutation Score');
            let temp = new Map();
            let reducedTestCasesIdsArray = Array.from(clusterToReducedTestCaseIds.values());
            console.log('Printing Reduced Test Case Ids');
            console.log(reducedTestCasesIdsArray);
            reducedTestCasesIdsArray.forEach((testCaseId) => {
                temp.set(
                    testCaseId,
                    reducedTestCaseIdToNumericVectors.get(testCaseId)
                );
            });
            reducedTestCaseIdToNumericVectors = temp;
            console.log('New Reduced Test Case Id To Numeric Vectors');
            console.log(reducedTestCaseIdToNumericVectors);
    
            k_size = k_size - step;
        }
        k_size = parseInt(k_size);
        kmeans.k = k_size;
    }
    let temp = new Map();
    let reducedTestCasesIdsArray = Array.from(clusterToReducedTestCaseIds.values());
    reducedTestCasesIdsArray.forEach((testCaseId) => {
        temp.set(
            testCaseId,
            reducedTestCaseIdToNumericVectors.get(testCaseId)
        );
    });
    reducedTestCaseIdToNumericVectors = temp;
    console.log('New Reduced Test Case Id To Numeric Vectors');
    console.log(reducedTestCaseIdToNumericVectors);
    console.log('Mutation Score of Reduced Test Suite:'+reducedMutationScore);
});

function getClusterToReducedTestCaseIds(testCaseIdToNumericVectors, clusters, centroids)
{
    let testCaseIdToCluster = getTestCaseIdToClusterMap(testCaseIdToNumericVectors, clusters);
    let clusterToTestCaseId = new Map();
    
    for (let [key, value] of testCaseIdToCluster)
    {
        if(!clusterToTestCaseId.has(value))
        {
            clusterToTestCaseId.set(value, key);
        }
    }
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

function getMutationScore(test_cases_csv_string)
{
    const { execFileSync } = require('child_process');
    const output = execFileSync("node", ["tools/quickMutationScore.js", "files/uuid-new.csv", test_cases_csv_string]);
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


