const express = require('express');
const router = express.Router();

var db = require('../controller/api');

console.log("In route.js");

router.get('/:table_name', db.get_data);

router.post('/:table_name', db.post_data);

router.put('/:table_name', db.put_data);

router.delete('/:table_name', db.delete_data);

module.exports = router;