'use strict'
var mongoose = require('mongoose');

var rateSchema = mongoose.Schema({
    rate: {type: Number, required: true},
    song_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    username: {type: String, required: true}
});

module.exports = mongoose.model('rate', rateSchema);