var config = require('./config');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');

var createResponse = function(status, data, res, indent) {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data, null, indent));
};


var cache = function() {
    var dir = process.cwd() + '/' + config.saveDirectory;
    var readdirAsync = Promise.promisify(fs.readdir);
    var readFileAsync = Promise.promisify(fs.readFile);
    var mkdirpAsync = Promise.promisify(mkdirp);
    return mkdirpAsync(dir)
    .then(function() {
        return readdirAsync(dir)
    })
    .then(function(files) {
        var promises = [];
        files.map(function(fileName) {
            promises.push(readFileAsync(dir + '/' + fileName, 'utf8'));
        });
        return Promise.all(promises);
    })
    .map(function(data) {
        var json = JSON.parse(data);
        return Promise.resolve(json.url);
    }, {concurrency: 20})
    .then(function(data) {
        fs.writeFile('cached.json', JSON.stringify(data, null, 2), { flag: 'w' });
        console.log("Re-caching complete.");
        return Promise.resolve(data);
    });
};

module.exports = {
    createResponse: createResponse,
    cache: cache
};
