const { execFileSync } = require('child_process');
let asyncVersions = [
    'async-2.4.0', 'async-2.5.0', 'async-2.6.0', 'async-2.6.1'
];
let bodyparserVersions = [
    'body-parser-1.16.0', 'body-parser-1.16.1', 'body-parser-1.17.0', 'body-parser-1.18.0', 'body-parser-1.18.2'
];
let cheerioVersions = [
    'cheerio-1.0.0'
];
let debugVersions = [
    'debug-3.2.0', 'debug-3.2.1', 'debug-3.2.2', 'debug-3.2.3', 'debug-3.2.4', 'debug-3.2.5',
    'debug-3.2.6', 'debug-3.2.7', 'debug-4.0.0'
];
let expressVersions = [
    'express-4.15.0', 'express-4.16.0', 'express-4.16.1', 'express-4.16.2', 'express-4.16.3'
];
let passportVersions = [
    'passport-0.2.0', 'passport-0.2.1', 'passport-0.2.2', 'passport-0.3.0', 'passport-0.3.1', 'passport-0.3.2',
    'passport-0.4.0', 'passport-0.4.1', 'passport-0.5.0'
];
let shortidVersions = [
    'shortid-2.2.7', 'shortid-2.2.8', 'shortid-2.2.9', 'shortid-2.2.10', 'shortid-2.2.11',
    'shortid-2.2.12', 'shortid-2.2.13', 'shortid-2.2.14', 'shortid-2.2.15', 'shortid-2.2.16'
];
let uuidVersions = [
    'uuid-3.0.1', 'uuid-3.1.0', 'uuid-3.2.0', 'uuid-3.2.1', 'uuid-3.3.0', 'uuid-3.3.1',
    'uuid-3.3.2', 'uuid-3.3.3', 'uuid-3.4.0'
];
let alphas = [5];
//5, 10, 15, 20, 25, 30, 35, 40, 45, 50
for(let alpha of alphas)
{
    for(let packageName of debugVersions)
    {
        execFileSync("node", ["kmred.js", packageName, 'mutation_matrix\\debug\\'+packageName+'.csv', 'kmpp', alpha ,1]);
    }
}