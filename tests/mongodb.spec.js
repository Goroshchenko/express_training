var config = require('../config')();

describe("MongoDB", function() {
    it("is there a server running", function(next) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db)  {
            expect(err).toBe(null);
            expect(db).toBeDefined();
            next();
        });
    });
});