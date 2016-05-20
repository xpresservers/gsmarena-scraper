var Promise = require('bluebird');
var express = require('express');
var scraper = Promise.promisifyAll(require('./scraper'));
var util = require('./util');
var config = require('./config');
var url = require('url');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
    var query = url.parse(req.url, true).query;
    var params = {
        start: Number(query.start),
        limit: Number(query.limit),
        pageLimit: Number(query.pageLimit),
        verbose: !!query.verbose,
    };

    var promiseCache = [];
    var globalIndex = 0;
    scraper.scrapCategoriesAsync(params).map(function(data) {
        promiseCache.push(data);
        var p = {
            url: data.url,
            limit: params.pageLimit,
            verbose: params.verbose,
        };
        return scraper.getPagesAsync(p);
    })
    .map(function(pageUrls) {
        var promises = [];
        for (var i = 0; i < pageUrls.length; i++) {
            var p = {
                name: promiseCache[globalIndex].name,
                url: pageUrls[i],
                data: promiseCache[globalIndex].data,
                verbose: params.verbose,
            };
            promises.push(scraper.scrapItemsFromACategoryAsync(p));
        }
        globalIndex++;
        return Promise.all(promises);
    })
    .then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var cache = {
                brand: '',
                brandUrls: [],
                quantity: 0,
                items: []
            };
            result[i].forEach(function(d2) {
                cache.brand = d2.brand;
                cache.brandUrls.push(d2.brandUrl);
                cache.quantity += d2.quantity;
                cache.items = cache.items.concat(d2.items)
            });
            result[i] = cache;
        };

        return Promise.resolve(result);
    })
    .then(function(data) {
        promiseCache = data;

        var promises = [];
        for (var i = 0; i < data.length; i++) {
            console.log('Processing ' + data[i].items.length + ' items from ' + data[i].brand + '...');
            for (var j = 0; j < data[i].items.length; j++) {
                var p = {
                    data: data[i],
                    brand: data[i].brand,
                    url: data[i].items[j].url,
                    verbose: params.verbose,
                };
                promises.push(scraper.scrapContentAsync(p));
            }
        }
        return Promise.all(promises);
    })
    .then(function(data) {
        console.log('Merging data...');
        var idx = 0;
        for (var i = 0; i < promiseCache.length; i++) {
            for (var j = 0; j < promiseCache[i].items.length; j++) {
                promiseCache[i].items[j].data = data[idx++];
            }
        }
        return Promise.resolve(promiseCache);
    })
    .then(function(data) {
        scraper.nScrapContent = 0;
        console.log('Done.');

        util.createResponse(200, data, res, 1);
    })
    .catch(function(error) {
        util.createResponse(500, error, res, 1);
        throw error;
    });
});

router.get('/files', function(req, res, next) {
    var query = url.parse(req.url, true).query;
    var params = {
        start: Number(query.start),
        limit: Number(query.limit),
        pageLimit: Number(query.pageLimit),
        verbose: !!query.verbose,
    };

    var cachedUrls = [];
    var promiseCache = [];
    var globalIndex = 0;

    fs.readFile('cached.json', 'utf8', function(err, files) {
        if (!err) {
            cachedUrls = JSON.parse(files);
        }
    });

    scraper.scrapCategoriesAsync(params)
    .map(function(data) {
        promiseCache.push(data);
        var p = {
            url: data.url,
            limit: params.pageLimit,
            verbose: params.verbose,
        };
        return scraper.getPagesAsync(p);
    }, {concurrency: 5})
    .map(function(pageUrls) {
        var promises = [];
        for (var i = 0; i < pageUrls.length; i++) {
            var p = {
                name: promiseCache[globalIndex].name,
                url: pageUrls[i],
                data: promiseCache[globalIndex].data,
                verbose: params.verbose,
            };
            promises.push(scraper.scrapItemsFromACategoryAsync(p));
        }
        globalIndex++;
        return Promise.all(promises);
    }, {concurrency: 5})
    .then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var cache = {
                brand: '',
                brandUrls: [],
                quantity: 0,
                items: []
            };
            result[i].forEach(function(d2) {
                cache.brand = d2.brand;
                cache.brandUrls.push(d2.brandUrl);
                cache.quantity += d2.quantity;
                cache.items = cache.items.concat(d2.items);
            });
            result[i] = cache;
        };

        return Promise.resolve(result);
    })
    .map(function(data) {
        var items = data.items;
        var promises = [];
        items.map(function(item) {
            var found = false;
            cachedUrls.forEach(function(cachedUrl) {
                if (item.url === cachedUrl) {
                    found = true;
                    return false;
                }
            });
            if (!found) {
                var p = {
                    brand: data.brand,
                    data: item,
                    verbose: params.verbose,
                };
                promises.push(scraper.scrapContentToFileAsync(p));
            } else {
                console.log('Skipped: ', item.url);
            }
        });

        return Promise.all(promises);
    }, {concurrency: 1})
    .map(function() {

    }, {concurrency: 5})
    .then(function() {
        scraper.nScrapContent = 0;
        console.log('Done.');

        util.createResponse(200, { status: 'ok', message: 'see in directory /scrapped' }, res, 1);
    })
    .catch(function(error) {
        util.createResponse(500, error, res, 1);
    })
    .finally(function() {
        util.cache();
    });

});

router.get('/cache', function(req, res, next) {
    //var query = url.parse(req.url, true).query;
    util.cache()
    .then(function(data) {
      util.createResponse(200, {count: data.length, data: data}, res, 1);
    })
    .catch(function(err) {
      util.createResponse(500, err, res, 1);
    });
});

router.get('/items', function(req, res, next) {
    var query = url.parse(req.url, true).query;
    var params = {
        start: Number(query.start),
        limit: Number(query.limit),
        pageLimit: Number(query.pageLimit),
        verbose: !!query.verbose,
    };

    var promiseCache = [];
    var globalIndex = 0;
    scraper.scrapCategoriesAsync(params).map(function(data) {
        promiseCache.push(data);
        var p = {
            url: data.url,
            limit: params.pageLimit,
            verbose: params.verbose,
        };
        return scraper.getPagesAsync(p);
    })
    .map(function(pageUrls) {
        var promises = [];
        for (var i = 0; i < pageUrls.length; i++) {
            var p = {
                name: promiseCache[globalIndex].name,
                url: pageUrls[i],
                data: promiseCache[globalIndex].data,
                verbose: params.verbose,
            };
            promises.push(scraper.scrapItemsFromACategoryAsync(p));
        }
        globalIndex++;
        return Promise.all(promises);
    })
    .then(function(result) {
        for (var i = 0; i < result.length; i++) {
            var cache = {
                brand: '',
                brandUrls: [],
                quantity: 0,
                items: []
            };
            result[i].forEach(function(d2) {
                cache.brand = d2.brand;
                cache.brandUrls.push(d2.brandUrl);
                cache.quantity += d2.quantity;
                cache.items = cache.items.concat(d2.items)
            });
            result[i] = cache;
        };

        return Promise.resolve(result);
    })
    .then(function(data) {
        console.log('Done.');

        util.createResponse(200, data, res, 1);
    })
    .catch(function(error) {
        util.createResponse(500, error, res, 1);
        throw error;
    });
});

router.get('/categories', function(req, res, next) {
    var query = url.parse(req.url, true).query;
    var params = {
        start: Number(query.start),
        limit: Number(query.limit),
        verbose: !!query.verbose,
    };

    scraper.scrapCategoriesAsync(params).then(function(data) {
        util.createResponse(200, data, res, 1);
    }).catch(function(error) {
        util.createResponse(500, error, res, 1);
    });
});

router.get('/content', function(req, res, next) {
    var query = url.parse(req.url, true).query;
    var params = {
        url: query.url,
        verbose: !!query.verbose,
    };

    scraper.scrapContentAsync(params).then(function(data) {
        util.createResponse(200, data, res, 1);
    }).catch(function(error) {
        util.createResponse(500, error, res, 1);
    });
});

module.exports = router;
