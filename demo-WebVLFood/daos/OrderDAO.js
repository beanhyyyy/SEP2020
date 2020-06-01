var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://kanghy:0979320779Qwe@cluster0-9lfpr.mongodb.net/dbSEP";
var OrderDAO = {
  insert: function (order) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbSEP");
        dbo.collection("orders").insertOne(order, function (err, res) {
          if (err) return reject(err);
          resolve(res.insertedCount > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  getAll: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbSEP");
        var query = {};
        dbo.collection("orders").find(query).toArray(function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  getDetails: function(id) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbSEP");
        var ObjectId = require('mongodb').ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("orders").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  update: function(id, newStatus) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbSEP");
        var ObjectId = require('mongodb').ObjectId;
        var query = { _id: ObjectId(id) };
        var newvalues = { $set: { status: newStatus } };
        dbo.collection("orders").updateOne(query, newvalues, function (err, res) {
          if (err) reject(err);
          resolve(res.result.nModified > 0 ? true : false);
          db.close();
        });
      });
    });
  }
};
module.exports = OrderDAO;