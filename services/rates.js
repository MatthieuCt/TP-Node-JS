'use strict'
var Promise = require('bluebird');
var Rates = Promise.promisifyAll(require('../database/rates'));

exports.findOneByQuery = function(query) {
    return Rates.findOneAsync(query);
};

exports.find = function(query) {
    return Rates.findAsync(query);
};

exports.create = function(rate) {
    return Rates.createAsync(rate);
};

exports.delete = function(rate_id) {
    return Rates.findByIdAndRemoveAsync(rate_id);
};

exports.deleteAll = function() {
    return Rates.removeAsync();
};

exports.update = function(rate, songToUpdate) {
    // return Songs.updateAsync({_id: songId}, songToUpdate); // updates but doesn't return updated document
    return Rates.findOneAndUpdateAsync({_id: rate}, songToUpdate, {new: true}); // https://github.com/Automattic/mongoose/issues/2756
};