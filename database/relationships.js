'use strict'
var mongoose = require('mongoose');

var relationshipSchema = mongoose.Schema({
    enquirer_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    enquirer_name: {type: String, required: true},
    target_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    target_name: {type: String, required: true},
    confirmed: {type: Boolean, required: true},
    createdAt: {type: Date, 'default': Date.now}
});

module.exports = mongoose.model('relationship', relationshipSchema);