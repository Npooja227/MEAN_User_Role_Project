const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/users';

var ObjectId = require('mongodb').ObjectID;

console.log("In api.js");

exports.get_data = (req, res) => {

    mongo.connect(url, { useUnifiedTopology: true }, (err, db) => {
        if (err) throw err;
        else {

            var array = []

            if (req.query.condition){
                req.query.condition = JSON.parse(req.query.condition);
                if(req.query.condition.$match){
                    if(req.query.condition.$match._id) req.query.condition.$match._id = ObjectId(req.query.condition.$match._id)
                }
                array.push(req.query.condition)
            } 
                        
            db.collection(req.params.table_name).aggregate(array).toArray((error, data) => {
                if (error) throw error;
                else {
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                    res.status(200).send(data);
                }
            })
            /*db.collection(req.params.table_name).find().toArray((error, data) => {
                if (error) throw error;
                else {
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                    res.status(200).send(data);
                }
            })*/
        }
    })
}


exports.post_data = (req, res) => {

    var arr = []
    if(!Array.isArray(req.body)){
        arr.push(req.body);
    } else arr = req.body

    mongo.connect(url,(err, db) => {
        if (err) throw err;
        else {
            db.collection(req.params.table_name).insertMany(arr, (error, data) => {
                if (error) throw error;
                else {
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
                    res.status(200).send(data);
                }
            })
        }
    })
}

exports.put_data = (req, res) => {

    if (req.query._id) {
        req.query._id = ObjectId(req.query._id)
    }
    mongo.connect(url, (err, db) => {
        if (err) throw err;
        db.collection(req.params.table_name).updateMany(req.query, { $set: req.body }, (error, data) => {
            if (error) throw error;
            res.status(200).send(data)
        })
    })
}

exports.delete_data = (req, res) => {

    var obj = {}

    if (req.query._id) {
        if (req.query._id.includes(',')) {
            obj = {
                _id: {
                    $in: []
                }
            }
            var arr = req.query._id.split(',');
            for (var i in arr) {
                obj._id.$in.push(ObjectId(arr[i]))
            }
        } else {
            obj = {
                _id: ObjectId(req.query._id)
            }
        }

    } else {
        obj = req.query
    }

    mongo.connect(url, (err, db) => {
        if (err) throw err;
        db.collection(req.params.table_name).deleteMany(obj, (error, data) => {
            if (error) throw error;
            res.status(200).send(data)
        });
    })
}