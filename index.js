const parse = require('json-to-ast');

const SETTINGS = {
    loc: false,
};

function outputElement(ast) {
    if (ast.type == 'Array') {
        return outputArray(ast);
    }
    if (ast.type == 'Object') {
        return outputObject(ast);
    }
    return ast.raw;
}

function outputArray(ast) {
    const elements = [];

    for (const element of ast.children) {
        elements.push(outputElement(element));
    }

    return `{${elements.join(', ')}}`;
}

function outputObject(ast) {
    const pairs = [];

    for (const element of ast.children) {
        if (element.type == 'Property') {
            pairs.push(`${element.key.value} = ${outputElement(element.value)}`);
        }
    }

    return `{${pairs.join(', ')}}`;
}

function outputLua(data) {
    const ast = parse(data, SETTINGS);
    return ast.type == 'Array' ? outputArray(ast) : outputObject(ast);
}

// Usage:

const arrayData = `
    [1, "hello world", true, ["bye", false, null], {"hello": "world"}]
`;
const objectData = `
    {"hello": "world", "bye": false, "another": [1, 2, false]}
`;

console.log(outputLua(arrayData));
console.log(outputLua(objectData));