var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sonkk:pwd@clustersgp-tj3gl.mongodb.net/storeonline";
var AdminDAO = {
  get: function(username, password) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("storeonline");
        var query = { username: username, password: password };
        dbo.collection("admin").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = AdminDAO;