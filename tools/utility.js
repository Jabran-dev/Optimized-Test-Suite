
function getVectorMap(function_map)
{
    let functions = function_map['functions'];
    let functions_vectors_map = {
        'functions' : []
    };
    functions.forEach((test_function) => {
        let inputs = test_function['inputs'];
        let outputs = test_function['outputs'];
        let input_vector = [];
        let output_vector = [];
        inputs.forEach((test_input) => {
            test_input['value'] = convertStringToNumber(test_input['value']);
            input_vector.push(test_input['value']);
        });
        outputs.forEach((test_output) => {
            test_output['value'] = convertStringToNumber(test_output['value']);
            output_vector.push(test_output['value']);
        });
        let functions_vectors = functions_vectors_map['functions'];
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
    getVectorMap
};